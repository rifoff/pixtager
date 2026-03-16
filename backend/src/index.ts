// src/index.ts
import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import { uploadRoutes }  from './routes/upload.js'
import { jobRoutes }     from './routes/jobs.js'
import { paymentRoutes } from './routes/payments.js'
import { authRoutes }    from './routes/auth.js'
import 'dotenv/config'

const app = Fastify({
  logger: { transport: { target: 'pino-pretty' } },
})

await app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })
await app.register(multipart, {
  limits: { fileSize: 15 * 1024 * 1024, files: 100 },
})

await app.register(authRoutes,    { prefix: '/api/auth'     })
await app.register(uploadRoutes,  { prefix: '/api/upload'   })
await app.register(jobRoutes,     { prefix: '/api/jobs'     })
await app.register(paymentRoutes, { prefix: '/api/payments' })

app.get('/health', async () => ({
  status: 'ok',
  app: 'PixTager API',
  ts: new Date().toISOString(),
}))

try {
  await app.listen({ port: Number(process.env.PORT) || 4000, host: '0.0.0.0' })
  console.log('PixTager API running on port 4000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
