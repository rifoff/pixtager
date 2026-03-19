// src/routes/admin.ts
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma.js'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-change-me'

function checkAuth(req: FastifyRequest, reply: FastifyReply): boolean {
  const token = req.headers['x-admin-secret']
  if (token !== ADMIN_SECRET) {
    reply.code(401).send({ error: 'Не авторизован' })
    return false
  }
  return true
}

export const adminRoutes: FastifyPluginAsync = async (app) => {

  // GET /api/admin/stats
  app.get('/stats', async (req, reply) => {
    if (!checkAuth(req, reply)) return

    const [totalUsers, totalJobs, totalFiles] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.job.aggregate({ _sum: { totalFiles: true } }),
    ])

    const planCounts = await prisma.user.groupBy({
      by: ['plan'],
      _count: { plan: true },
    })

    const recentUsers = await prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    })

    return {
      totalUsers,
      totalJobs,
      totalFiles: totalFiles._sum.totalFiles || 0,
      recentUsers,
      planCounts: planCounts.map(p => ({ plan: p.plan, count: p._count.plan })),
    }
  })

  // GET /api/admin/users
  app.get('/users', async (req, reply) => {
    if (!checkAuth(req, reply)) return

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        plan: true,
        quotaUsed: true,
        createdAt: true,
        _count: { select: { jobs: true } },
      },
    })

    return users.map(u => ({
      id: u.id,
      email: u.email,
      plan: u.plan,
      quotaUsed: u.quotaUsed,
      jobsCount: u._count.jobs,
      createdAt: u.createdAt,
    }))
  })

  // GET /api/admin/jobs
  app.get('/jobs', async (req, reply) => {
    if (!checkAuth(req, reply)) return

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        settings: { select: { businessName: true, mode: true } },
        user: { select: { email: true } },
      },
    })

    return jobs.map(j => ({
      id: j.id,
      status: j.status,
      totalFiles: j.totalFiles,
      processed: j.processed,
      businessName: j.settings?.businessName,
      mode: j.settings?.mode,
      userEmail: j.user?.email,
      createdAt: j.createdAt,
    }))
  })

  // PATCH /api/admin/users/:id/plan
  app.patch<{ Params: { id: string }; Body: { plan: string } }>(
    '/users/:id/plan', async (req, reply) => {
      if (!checkAuth(req, reply)) return

      const { plan } = req.body
      if (!['FREE', 'STARTER', 'PRO', 'AGENCY'].includes(plan)) {
        return reply.code(400).send({ error: 'Неверный тариф' })
      }

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { plan: plan as any },
      })

      return { id: user.id, email: user.email, plan: user.plan }
    }
  )
}