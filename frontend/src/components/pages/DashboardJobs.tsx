// src/components/pages/DashboardJobs.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui'
import { showToast } from '@/components/ui'
import { useStore } from '@/lib/store'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const MODE_SHORT: Record<string, string> = {
  YANDEX_MAPS: 'Я.Карты',
  YANDEX_IMAGES: 'Я.Картинки',
  GOOGLE_MAPS: 'G.Maps',
  GEO_SEO: 'GEO SEO',
}

interface Job {
  id: string
  status: string
  totalFiles: number
  processed: number
  zipUrl: string | null
  createdAt: string
  settings?: {
    businessName: string
    address: string
    niche: string | null
    mode: string
  } | null
}

export function DashboardJobs() {
  const { user } = useStore()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!user?.token) return
    fetch(`${API}/api/jobs`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(r => r.json())
      .then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { showToast('Ошибка загрузки заданий', 'err'); setLoading(false) })
  }, [user?.token])

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status.toLowerCase() === filter)

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-display text-2xl font-bold tracking-tight">Задания</h1>
        <Link href="/app" className="btn btn-primary btn-sm">+ Новое задание</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {[['all','Все'],['done','Готово'],['processing','Обработка'],['failed','Ошибка']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-lg border transition-all ${
              filter === val
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-2 text-txt-3 hover:border-border-2'
            }`}>
            {label}
            <span className="ml-2 font-mono text-[10px] opacity-70">
              {val === 'all' ? jobs.length : jobs.filter(j => j.status.toLowerCase() === val).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-bg-2 border border-border rounded-xl p-14 text-center text-txt-3">
          Загрузка...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-2 border border-border rounded-xl p-14 text-center">
          <div className="text-4xl mb-4 opacity-30">⚡</div>
          <div className="text-[15px] font-semibold text-txt-2 mb-2">
            {jobs.length === 0 ? 'Заданий пока нет' : 'Нет заданий в этом статусе'}
          </div>
          {jobs.length === 0 && (
            <Link href="/app" className="btn btn-primary btn-sm mt-4 inline-flex">
              Создать первое задание
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Бизнес / адрес','Файлов','Режим','Ниша','Статус','Дата',''].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-txt-3 px-4 py-3 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id} className="hover:bg-bg-3 transition-colors group">
                  <td className="px-4 py-3.5 border-b border-border">
                    <div className="text-[13px] font-medium">{job.settings?.businessName || '—'}</div>
                    <div className="font-mono text-[11px] text-txt-3 mt-0.5 truncate max-w-[220px]">{job.settings?.address || '—'}</div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border font-mono text-[13px] text-accent">{job.totalFiles}</td>
                  <td className="px-4 py-3.5 border-b border-border text-[12px] text-txt-3">{MODE_SHORT[job.settings?.mode || ''] || '—'}</td>
                  <td className="px-4 py-3.5 border-b border-border text-[12px] text-txt-2">{job.settings?.niche || '—'}</td>
                  <td className="px-4 py-3.5 border-b border-border"><StatusBadge status={job.status.toLowerCase()} /></td>
                  <td className="px-4 py-3.5 border-b border-border font-mono text-[11px] text-txt-3">{fmtDate(job.createdAt)}</td>
                  <td className="px-4 py-3.5 border-b border-border">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {job.zipUrl && (
                        <a href={`${API}/api/jobs/${job.id}/download`}
                          className="btn btn-ghost btn-sm">↓ ZIP</a>
                      )}
                      {job.status === 'FAILED' && (
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => showToast('Повтор пока недоступен', 'info')}>↺</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-5 text-[12px] text-txt-3">
        <span>Всего фото: <span className="text-accent font-mono font-bold">{jobs.reduce((s,j) => s + j.totalFiles, 0)}</span></span>
        <span>·</span>
        <span>Заданий: <span className="font-mono font-bold text-txt-2">{jobs.length}</span></span>
      </div>
    </div>
  )
}