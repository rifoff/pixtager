// src/lib/queue.ts
import { Queue } from 'bullmq'
import IORedis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379'

export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
})

export const imageQueue = new Queue('image-processing', {
  connection: redisConnection as any,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
})
