// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://pixtager.ru/api-backend'

export async function startJob(files: File[], settings: object, userId: string) {
  const form = new FormData()
  files.forEach(f => form.append('files', f))
  form.append('settings', JSON.stringify(settings))
  const res = await fetch(`${BASE}/upload/start`, {
    method: 'POST',
    headers: { 'x-user-id': userId },
    body: form,
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Ошибка загрузки')
  return res.json() as Promise<{ jobId: string; fileCount: number }>
}

export async function pollJob(jobId: string, userId: string) {
  const res = await fetch(`${BASE}/jobs/${jobId}`, {
    headers: { 'x-user-id': userId },
  })
  if (!res.ok) throw new Error('Ошибка получения статуса')
  return res.json()
}

export async function getJobs(userId: string) {
  const res = await fetch(`${BASE}/jobs`, {
    headers: { 'x-user-id': userId },
  })
  if (!res.ok) return []
  return res.json()
}
