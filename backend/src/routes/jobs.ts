// src/routes/jobs.ts
import { FastifyPluginAsync } from 'fastify'
import { createReadStream, existsSync } from 'fs'
import path from 'path'
import { prisma } from '../lib/prisma.js'
import { imageQueue } from '../lib/queue.js'

export const jobRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/jobs/:id — poll job status
  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { settings: true, files: true },
    })
    if (!job) return reply.code(404).send({ error: 'Задание не найдено' })

    // Get queue progress
    const queueJob = await imageQueue.getJob(req.params.id)
    const progress = queueJob ? await queueJob.progress : null

    return {
      id: job.id,
      status: job.status,
      totalFiles: job.totalFiles,
      processed: job.processed,
      progress: typeof progress === 'number' ? progress : null,
      zipUrl: job.zipUrl,
      expiresAt: job.expiresAt,
      files: job.files.map(f => ({
        originalName: f.originalName,
        seoName: f.seoName,
        altTag: f.altTag,
        status: f.status,
      })),
      settings: job.settings ? {
        businessName: job.settings.businessName,
        city: job.settings.city,
        mode: job.settings.mode,
        niche: job.settings.niche,
      } : null,
    }
  })

  // GET /api/jobs/:id/download — stream ZIP file
  app.get<{ Params: { id: string } }>('/:id/download', async (req, reply) => {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } })
    if (!job) return reply.code(404).send({ error: 'Задание не найдено' })
    if (job.status !== 'DONE') return reply.code(409).send({ error: 'Задание ещё не завершено' })
    if (job.expiresAt && job.expiresAt < new Date()) {
      return reply.code(410).send({ error: 'Ссылка устарела (24 часа)' })
    }

    const uploadDir = process.env.UPLOAD_DIR || '/tmp/pixtager'
    // Find zip file
    const zipPath = path.join(uploadDir, job.id, `pixtager-${job.id.slice(0, 8)}.zip`)

    if (!existsSync(zipPath)) {
      return reply.code(404).send({ error: 'Файл не найден на сервере' })
    }

    return reply
      .header('Content-Type', 'application/zip')
      .header('Content-Disposition', `attachment; filename="pixtager-${job.id.slice(0, 8)}.zip"`)
      .send(createReadStream(zipPath))
  })

  // GET /api/jobs — list user's jobs
  app.get('/', async (req, reply) => {
    const userId = req.headers['x-user-id'] as string || 'demo-user'
    const jobs = await prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { settings: { select: { businessName: true, mode: true, niche: true } } },
    })
    return jobs.map(j => ({
      id: j.id,
      status: j.status,
      totalFiles: j.totalFiles,
      processed: j.processed,
      businessName: j.settings?.businessName,
      mode: j.settings?.mode,
      createdAt: j.createdAt,
      expiresAt: j.expiresAt,
    }))
  })
}
