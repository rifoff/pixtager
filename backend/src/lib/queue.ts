// src/lib/queue.ts
// @ts-nocheck
import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379'

export const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
})

export const imageQueue = new Queue('image-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
})
