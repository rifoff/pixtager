// src/components/pages/LandingNicheDemo.tsx
'use client'
import { useState } from 'react'
import { NICHES } from '@/lib/niches'
import clsx from 'clsx'

export function LandingNicheDemo() {
  const [active, setActive] = useState<string | null>(null)
  const niche = NICHES.find(n => n.id === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {NICHES.map(n => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            className={clsx(
              'px-4 py-2 text-[13px] rounded-lg border transition-all duration-150',
              active === n.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-2 text-txt-2 hover:border-border-2',
            )}
          >
            {n.name}
          </button>
        ))}
      </div>

      <div className="bg-bg-3 border border-border rounded-xl p-4 min-h-[70px]">
        {!niche ? (
          <span className="text-txt-3 text-sm">Выберите нишу выше →</span>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-[10px] text-txt-3 mb-2">// кириллица (Яндекс)</div>
              <div className="flex flex-wrap gap-1.5">
                {niche.ru.map(k => (
                  <span key={k} className="font-mono text-[11px] bg-bg-2 border border-border rounded px-2 py-0.5 text-txt-2">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-txt-3 mb-2">// латиница (Google)</div>
              <div className="flex flex-wrap gap-1.5">
                {niche.en.map(k => (
                  <span key={k} className="font-mono text-[11px] bg-accent/5 border border-accent/20 rounded px-2 py-0.5 text-accent/80">{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
