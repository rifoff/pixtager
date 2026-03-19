// src/routes/auth.ts
import { FastifyPluginAsync } from 'fastify'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { z } from 'zod'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + process.env.PASSWORD_SALT).digest('hex')
}

function generateToken(userId: string): string {
  // In production: use JWT with RS256. For MVP: signed HMAC token
  const payload = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64')
  const sig = crypto.createHmac('sha256', process.env.JWT_SECRET || 'dev-secret').update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const [payload, sig] = token.split('.')
    const expected = crypto.createHmac('sha256', process.env.JWT_SECRET || 'dev-secret').update(payload).digest('hex')
    if (sig !== expected) return null
    const data = JSON.parse(Buffer.from(payload, 'base64').toString())
    if (Date.now() - data.ts > 30 * 24 * 60 * 60 * 1000) return null // 30 days
    return { userId: data.userId }
  } catch {
    return null
  }
}

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: { email: string; password: string } }>('/register', async (req, reply) => {
    const parsed = RegisterSchema.safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: 'Некорректные данные' })

    const { email, password } = parsed.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return reply.code(409).send({ error: 'Email уже зарегистрирован' })

    const user = await prisma.user.create({
      data: { email, passwordHash: hashPassword(password), plan: 'FREE' }
    })

    return { token: generateToken(user.id), userId: user.id, plan: user.plan }
  })

  app.post<{ Body: { email: string; password: string } }>('/login', async (req, reply) => {
    const { email, password } = req.body || {}
    if (!email || !password) return reply.code(400).send({ error: 'Email и пароль обязательны' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.passwordHash !== hashPassword(password)) {
      return reply.code(401).send({ error: 'Неверный email или пароль' })
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      quotaUsed: user.quotaUsed,
    }
  })

  app.get('/me', async (req, reply) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return reply.code(401).send({ error: 'Не авторизован' })
    const payload = verifyToken(auth.slice(7))
    if (!payload) return reply.code(401).send({ error: 'Токен недействителен' })

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return reply.code(404).send({ error: 'Пользователь не найден' })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      quotaUsed: user.quotaUsed,
    }
  })
  // PATCH /api/auth/profile
app.patch<{ Body: { email?: string; name?: string } }>('/profile', async (req, reply) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return reply.code(401).send({ error: 'Не авторизован' })
  const payload = verifyToken(auth.slice(7))
  if (!payload) return reply.code(401).send({ error: 'Токен недействителен' })

  const { email, name } = req.body || {}
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      ...(email ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    },
  })
  return { id: user.id, email: user.email, name: user.name, plan: user.plan }
})

// PATCH /api/auth/password
app.patch<{ Body: { oldPassword: string; newPassword: string } }>('/password', async (req, reply) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return reply.code(401).send({ error: 'Не авторизован' })
  const payload = verifyToken(auth.slice(7))
  if (!payload) return reply.code(401).send({ error: 'Токен недействителен' })

  const { oldPassword, newPassword } = req.body || {}
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || user.passwordHash !== hashPassword(oldPassword)) {
    return reply.code(401).send({ error: 'Неверный текущий пароль' })
  }
  if (newPassword.length < 8) return reply.code(400).send({ error: 'Пароль минимум 8 символов' })

  await prisma.user.update({
    where: { id: payload.userId },
    data: { passwordHash: hashPassword(newPassword) },
  })
  return { ok: true }
})
}
