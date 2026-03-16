// src/lib/queue.ts
import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

export const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
})

export const imageQueue = new Queue('image-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 }, // keep completed jobs 1h
    removeOnFail: { age: 86400 },
  },
})
