// src/components/pages/DashboardJobs.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui'
import { showToast } from '@/components/ui'

const ALL_JOBS = [
  { id:'j1', business:'Стоматология Улыбка', address:'ул. Тверская 10, Москва',        files:8,  mode:'YANDEX_MAPS',   niche:'Стоматология', status:'done',       date:'15.03.2025', zip:true },
  { id:'j2', business:'Кафе Белый медведь',  address:'Невский пр. 45, СПб',             files:23, mode:'YANDEX_IMAGES', niche:'Ресторан',      status:'done',       date:'12.03.2025', zip:true },
  { id:'j3', business:'ЖК Садовый',          address:'ул. Ленина 5, Екатеринбург',      files:5,  mode:'GOOGLE_MAPS',   niche:'Недвижимость',  status:'processing', date:'16.03.2025', zip:false },
  { id:'j4', business:'Фитнес Форма',        address:'пр. Мира 12, Казань',             files:14, mode:'GEO_SEO',       niche:'Фитнес',        status:'done',       date:'10.03.2025', zip:true },
  { id:'j5', business:'Клиника Здоровье',    address:'ул. Садовая 3, Краснодар',        files:31, mode:'YANDEX_MAPS',   niche:'Клиника',       status:'failed',     date:'08.03.2025', zip:false },
]

const MODE_SHORT: Record<string, string> = {
  YANDEX_MAPS:'Я.Карты', YANDEX_IMAGES:'Я.Картинки', GOOGLE_MAPS:'G.Maps', GEO_SEO:'GEO SEO',
}

export function DashboardJobs() {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? ALL_JOBS : ALL_JOBS.filter(j => j.status === filter)

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
              {val === 'all' ? ALL_JOBS.length : ALL_JOBS.filter(j => j.status === val).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bg-2 border border-border rounded-xl p-14 text-center">
          <div className="text-4xl mb-4 opacity-30">⚡</div>
          <div className="text-[15px] font-semibold text-txt-2 mb-2">Нет заданий в этом статусе</div>
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
                    <div className="text-[13px] font-medium">{job.business}</div>
                    <div className="font-mono text-[11px] text-txt-3 mt-0.5 truncate max-w-[220px]">{job.address}</div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border font-mono text-[13px] text-accent">{job.files}</td>
                  <td className="px-4 py-3.5 border-b border-border text-[12px] text-txt-3">{MODE_SHORT[job.mode]}</td>
                  <td className="px-4 py-3.5 border-b border-border text-[12px] text-txt-2">{job.niche}</td>
                  <td className="px-4 py-3.5 border-b border-border"><StatusBadge status={job.status} /></td>
                  <td className="px-4 py-3.5 border-b border-border font-mono text-[11px] text-txt-3">{job.date}</td>
                  <td className="px-4 py-3.5 border-b border-border">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {job.zip && (
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Скачивание ZIP...', 'ok')}>↓ ZIP</button>
                      )}
                      {job.status === 'failed' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Задание поставлено в очередь повторно', 'ok')}>↺</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="flex gap-4 mt-5 text-[12px] text-txt-3">
        <span>Всего фото обработано: <span className="text-accent font-mono font-bold">{ALL_JOBS.reduce((s,j)=>s+j.files,0)}</span></span>
        <span>·</span>
        <span>Заданий: <span className="font-mono font-bold text-txt-2">{ALL_JOBS.length}</span></span>
      </div>
    </div>
  )
}
