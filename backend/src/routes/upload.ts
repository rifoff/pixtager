// src/routes/upload.ts
import { FastifyPluginAsync } from 'fastify'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '../lib/prisma.js'
import { imageQueue } from '../lib/queue.js'
import { z } from 'zod'

const QUOTA = { FREE: 10, STARTER: 100, PRO: 1000, AGENCY: 5000 }

const SettingsSchema = z.object({
  businessName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().default('Россия'),
  author: z.string().optional(),
  copyright: z.string().optional(),
  niche: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  mode: z.enum(['YANDEX_MAPS', 'YANDEX_IMAGES', 'GOOGLE_MAPS', 'GEO_SEO']).default('YANDEX_MAPS'),
  gpsLat: z.number().nullable().optional(),
  gpsLon: z.number().nullable().optional(),
})

export const uploadRoutes: FastifyPluginAsync = async (app) => {
  // POST /api/upload/start — create job, upload files, enqueue
  app.post('/start', async (req, reply) => {
    // In production: verify JWT, get userId from token
    // For MVP demo: use a fixed userId or create guest session
    const userId = req.headers['x-user-id'] as string || 'demo-user'

    // Check quota
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      // Auto-create demo user
      user = await prisma.user.create({
        data: { id: userId, email: `${userId}@demo.local`, passwordHash: '', plan: 'FREE' }
      })
    }

    const quota = QUOTA[user.plan]
    if (user.quotaUsed >= quota) {
      return reply.code(429).send({ error: `Квота исчерпана. Лимит на тарифе ${user.plan}: ${quota} фото/мес.` })
    }

    const parts = req.parts()
    const files: { name: string; data: Buffer; mime: string }[] = []
    let settingsRaw: Record<string, unknown> = {}

    for await (const part of parts) {
      if (part.type === 'file') {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) chunks.push(chunk)
        const buf = Buffer.concat(chunks)
        if (!part.mimetype.startsWith('image/')) continue
        if (buf.length > 15 * 1024 * 1024) continue
        files.push({ name: part.filename, data: buf, mime: part.mimetype })
      } else {
        settingsRaw[part.fieldname] = part.value
      }
    }

    if (!files.length) return reply.code(400).send({ error: 'Нет файлов' })

    // parse settings from JSON field or individual fields
    let settings: z.infer<typeof SettingsSchema>
    try {
      const raw = settingsRaw.settings ? JSON.parse(settingsRaw.settings as string) : settingsRaw
      settings = SettingsSchema.parse(raw)
    } catch (e) {
      return reply.code(400).send({ error: 'Некорректные настройки', details: e })
    }

    // Create job in DB
    const job = await prisma.job.create({
      data: {
        userId,
        totalFiles: files.length,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        settings: {
          create: {
            businessName: settings.businessName,
            address: settings.address,
            city: settings.city,
            country: settings.country,
            author: settings.author,
            copyright: settings.copyright,
            niche: settings.niche,
            keywords: settings.keywords,
            mode: settings.mode,
            gpsLat: settings.gpsLat,
            gpsLon: settings.gpsLon,
          }
        }
      }
    })

    // Save files to temp storage
    const uploadDir = path.join(process.env.UPLOAD_DIR || '/tmp/pixtager', job.id)
    await mkdir(uploadDir, { recursive: true })

    const jobFiles = await Promise.all(files.map(async (f, i) => {
      const storageKey = `${job.id}/${randomUUID()}_${f.name}`
      const filePath = path.join(process.env.UPLOAD_DIR || '/tmp/pixtager', storageKey)
      await mkdir(path.dirname(filePath), { recursive: true })
      await writeFile(filePath, f.data)
      return prisma.jobFile.create({
        data: { jobId: job.id, originalName: f.name, storageKey, status: 'pending' }
      })
    }))

    // Enqueue processing job
    await imageQueue.add('process-job', { jobId: job.id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    })

    // Update quota
    await prisma.user.update({
      where: { id: userId },
      data: { quotaUsed: { increment: files.length } }
    })

    return reply.code(202).send({
      jobId: job.id,
      fileCount: files.length,
      message: 'Задание поставлено в очередь',
    })
  })
}
