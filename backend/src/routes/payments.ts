// src/routes/payments.ts
import { FastifyPluginAsync } from 'fastify'
import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'

const PLANS = {
  STARTER: { amount: 89000, name: 'Старт', quota: 100 },  // в копейках
  PRO:     { amount: 249000, name: 'Про', quota: 1000 },
  AGENCY:  { amount: 690000, name: 'Агентство', quota: 5000 },
} as const

type PlanKey = keyof typeof PLANS

// Tinkoff signature: sort all params alphabetically, concat values, SHA-256 with terminal password
function tinkoffSign(params: Record<string, unknown>, password: string): string {
  const sorted = Object.keys(params)
    .filter(k => k !== 'Token' && k !== 'Receipt' && k !== 'DATA')
    .sort()
    .reduce((acc, k) => acc + String(params[k]), '')
  return crypto.createHash('sha256').update(sorted + password).digest('hex')
}

export const paymentRoutes: FastifyPluginAsync = async (app) => {
  const TERMINAL = process.env.TINKOFF_TERMINAL_KEY!
  const PASSWORD = process.env.TINKOFF_PASSWORD!

  // POST /api/payments/init — create payment session
  app.post<{ Body: { plan: PlanKey; userId: string; email: string } }>(
    '/init',
    async (req, reply) => {
      const { plan, userId, email } = req.body
      if (!PLANS[plan]) return reply.code(400).send({ error: 'Неверный тариф' })

      const planData = PLANS[plan]
      const orderId = `${userId}-${plan}-${Date.now()}`

      const params: Record<string, unknown> = {
        TerminalKey: TERMINAL,
        Amount: planData.amount,
        OrderId: orderId,
        Description: `PixTager — тариф «${planData.name}»`,
        CustomerKey: userId,
        Recurrent: 'Y',  // Enable recurring payments
        NotificationURL: `${process.env.API_URL}/api/payments/webhook`,
        SuccessURL: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
        FailURL: `${process.env.FRONTEND_URL}/pricing?payment=fail`,
        Receipt: {
          Email: email,
          Taxation: 'usn_income',
          Items: [{
            Name: `PixTager — тариф «${planData.name}»`,
            Price: planData.amount,
            Quantity: 1,
            Amount: planData.amount,
            Tax: 'none',
            PaymentMethod: 'full_payment',
            PaymentObject: 'service',
          }],
        },
      }
      params.Token = tinkoffSign(params, PASSWORD)

      // Call Tinkoff Init API
      const res = await fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      const data = await res.json()

      if (!data.Success) {
        app.log.error('Tinkoff Init failed', data)
        return reply.code(502).send({ error: 'Ошибка платёжной системы', details: data.Message })
      }

      return { paymentUrl: data.PaymentURL, paymentId: data.PaymentId, orderId }
    }
  )

  // POST /api/payments/webhook — Tinkoff notification
  app.post('/webhook', async (req, reply) => {
    const body = req.body as Record<string, unknown>

    // Verify signature
    const expected = tinkoffSign(body, PASSWORD)
    if (body.Token !== expected) {
      app.log.warn('Tinkoff webhook: invalid token')
      return reply.code(400).send('Invalid token')
    }

    const { Status, OrderId, RebillId, CustomerKey } = body as Record<string, string>

    if (Status === 'CONFIRMED') {
      const [userId, plan] = (OrderId as string).split('-')
      const planKey = plan as PlanKey
      if (!PLANS[planKey]) return reply.send('OK')

      // Activate subscription
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: planKey,
          rebillId: RebillId || null,
          quotaUsed: 0, // reset quota on new billing period
        },
      })

      await prisma.subscription.upsert({
        where: { id: `${userId}-${planKey}` },
        create: {
          id: `${userId}-${planKey}`,
          userId,
          plan: planKey,
          rebillId: RebillId,
          status: 'active',
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          rebillId: RebillId,
          status: 'active',
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      app.log.info(`Subscription activated: user=${userId} plan=${planKey}`)
    }

    return reply.send('OK')
  })

  // POST /api/payments/charge-recurring — charge next period (cron job)
  app.post('/charge-recurring', async (req, reply) => {
    // Only callable internally
    if (req.headers['x-internal-key'] !== process.env.INTERNAL_KEY) {
      return reply.code(401).send('Unauthorized')
    }

    const expiredSubs = await prisma.subscription.findMany({
      where: { status: 'active', periodEnd: { lte: new Date() } },
      include: { user: true },
    })

    const results = []
    for (const sub of expiredSubs) {
      if (!sub.rebillId) continue
      const planData = PLANS[sub.plan as PlanKey]
      if (!planData) continue

      const params: Record<string, unknown> = {
        TerminalKey: TERMINAL,
        Amount: planData.amount,
        OrderId: `${sub.userId}-${sub.plan}-${Date.now()}`,
        RebillId: sub.rebillId,
        Description: `PixTager — продление «${planData.name}»`,
      }
      params.Token = tinkoffSign(params, PASSWORD)

      const res = await fetch('https://securepay.tinkoff.ru/v2/Charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      const data = await res.json()
      results.push({ userId: sub.userId, plan: sub.plan, success: data.Success })
    }

    return results
  })
}
