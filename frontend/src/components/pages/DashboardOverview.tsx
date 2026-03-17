// src/components/pages/DashboardOverview.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { PLANS } from '@/lib/constants'
import { ProgressBar, StatusBadge } from '@/components/ui'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const MODE_SHORT: Record<string, string> = {
  YANDEX_MAPS: 'Я.Карты', YANDEX_IMAGES: 'Я.Картинки', GOOGLE_MAPS: 'G.Maps', GEO_SEO: 'GEO SEO',
}

interface Job {
  id: string
  status: string
  totalFiles: number
  zipUrl: string | null
  createdAt: string
  settings?: { businessName: string; address: string; mode: string } | null
}

export function DashboardOverview() {
  const { user } = useStore()
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    if (!user?.token) return
    fetch(`${API}/api/jobs`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(r => r.json())
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [user?.token])

  if (!user) return null

  const planKey = ((user.plan ?? 'FREE').toUpperCase()) as keyof typeof PLANS
  const plan = PLANS[planKey] ?? PLANS['FREE']
  const pct = Math.round((user.quotaUsed / plan.quota) * 100)
  const totalPhotos = jobs.reduce((s, j) => s + j.totalFiles, 0)
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-display text-2xl font-bold tracking-tight">Обзор</h1>
        <Link href="/app" className="btn btn-primary btn-sm">+ Новое задание</Link>
      </div>

      {user.plan === 'FREE' && (
        <div className="flex items-center justify-between bg-accent/8 border border-accent/20 rounded-xl px-5 py-4 mb-6">
          <div>
            <div className="text-[13px] font-semibold">Вы на бесплатном тарифе</div>
            <div className="text-[12px] text-txt-2 mt-0.5">
              Использовано <span className="text-accent">{user.quotaUsed}</span> из 10 фото в этом месяце
            </div>
          </div>
          <Link href="/dashboard/billing" className="btn btn-primary btn-sm">Улучшить тариф ↑</Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { val: totalPhotos, label: 'Фото обработано', color: 'text-accent' },
          { val: jobs.length, label: 'Заданий всего', color: 'text-ok' },
          { val: `${user.quotaUsed}/${plan.quota}`, label: 'Квота этого месяца', color: 'text-txt' },
          { val: user.plan, label: 'Текущий тариф', color: 'text-txt' },
        ].map(s => (
          <div key={s.label} className="bg-bg-2 border border-border rounded-xl p-4">
            <div className={`font-mono text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[11px] text-txt-3 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-bg-2 border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[13px] font-semibold">Квота фотографий</div>
            <div className="text-[12px] text-txt-3 mt-0.5">Обновляется 1-го числа каждого месяца</div>
          </div>
          <div className="font-mono text-[13px] text-txt">{user.quotaUsed} / {plan.quota}</div>
        </div>
        <ProgressBar pct={pct} color={pct >= 80 ? 'ok' : 'accent'} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-txt-2">Последние задания</div>
        <Link href="/dashboard/jobs" className="btn btn-ghost btn-sm">Все задания →</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-bg-2 border border-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4 opacity-40">📂</div>
          <div className="text-[15px] font-semibold text-txt-2 mb-2">Заданий пока нет</div>
          <div className="text-[13px] text-txt-3 mb-5">Загрузите первые фотографии для SEO-оптимизации</div>
          <Link href="/app" className="btn btn-primary">Начать →</Link>
        </div>
      ) : (
        <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Бизнес / адрес','Файлов','Режим','Статус','Дата',''].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-txt-3 px-4 py-3 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 3).map(job => (
                <tr key={job.id} className="hover:bg-bg-3 transition-colors">
                  <td className="px-4 py-3.5 border-b border-border">
                    <div className="text-[13px] font-medium">{job.settings?.businessName || '—'}</div>
                    <div className="font-mono text-[11px] text-txt-3 mt-0.5 truncate max-w-[220px]">{job.settings?.address || '—'}</div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border font-mono text-[13px] text-accent">{job.totalFiles}</td>
                  <td className="px-4 py-3.5 border-b border-border text-[12px] text-txt-3">{MODE_SHORT[job.settings?.mode || ''] || '—'}</td>
                  <td className="px-4 py-3.5 border-b border-border"><StatusBadge status={job.status.toLowerCase()} /></td>
                  <td className="px-4 py-3.5 border-b border-border font-mono text-[11px] text-txt-3">{fmtDate(job.createdAt)}</td>
                  <td className="px-4 py-3.5 border-b border-border">
                    {job.zipUrl && (
                      <a href={`${API}/api/jobs/${job.id}/download`} className="btn btn-ghost btn-sm">↓ ZIP</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
