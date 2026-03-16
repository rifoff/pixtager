// src/components/pages/AppSettings.tsx
'use client'
import { useStore } from '@/lib/store'
import { NICHES, getNiche, generateGeoKeywords } from '@/lib/niches'
import { SEO_MODES } from '@/lib/constants'
import { showToast } from '@/components/ui'
import clsx from 'clsx'

export function AppSettings() {
  const { settings, updateSettings, setAppStep, files } = useStore()
  const s = settings

  function loadNiche(id: string) {
    const n = getNiche(id)
    if (n) updateSettings({ niche: id, keywords: [...n.ru, ...n.en] })
    else updateSettings({ niche: id })
  }

  function handleAddress(address: string) {
    updateSettings({ address })
    const city = address.split(',').pop()?.trim()
    if (city && city.length > 2) updateSettings({ city })
  }

  const niche     = getNiche(s.niche)
  const geoVars   = s.mode === 'GEO_SEO' && niche && s.city
    ? generateGeoKeywords(niche.ru[0], s.city) : []
  const canSubmit = s.businessName.trim() && s.address.trim()

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Настройки SEO</h1>
      <p className="text-txt-2 text-sm mb-7">
        Данные будут прошиты в IPTC-метаданные всех {files.length} {files.length === 1 ? 'фотографии' : 'фотографий'}.
      </p>

      {/* Mode selector */}
      <div className="mb-6">
        <div className="label mb-2">Режим оптимизации</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(SEO_MODES) as [string, { label: string; short: string; pro?: boolean }][]).map(([key, m]) => (
            <button key={key} onClick={() => updateSettings({ mode: key as any })}
              className={clsx(
                'relative flex flex-col items-start gap-1 p-3 rounded-xl border text-left text-sm font-medium transition-all',
                s.mode === key
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-2 text-txt-2 hover:border-border-2',
              )}>
              {m.pro && <span className="absolute top-2 right-2 font-mono text-[9px] font-bold bg-accent text-black px-1.5 py-0.5 rounded">PRO</span>}
              <span className="font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Название бизнеса *</label>
          <input className="input" placeholder="Стоматология Улыбка" value={s.businessName} onChange={e => updateSettings({ businessName: e.target.value })} />
        </div>
        <div>
          <label className="label">Адрес *</label>
          <input className="input" placeholder="ул. Тверская 10, Москва" value={s.address} onChange={e => handleAddress(e.target.value)} />
        </div>
        <div>
          <label className="label">Город</label>
          <input className="input" placeholder="Москва" value={s.city} onChange={e => updateSettings({ city: e.target.value })} />
        </div>
        <div>
          <label className="label">Страна</label>
          <input className="input" value={s.country} onChange={e => updateSettings({ country: e.target.value })} />
        </div>
        <div>
          <label className="label">Автор / бренд</label>
          <input className="input" placeholder="ООО Улыбка" value={s.author} onChange={e => updateSettings({ author: e.target.value })} />
        </div>
        <div>
          <label className="label">Копирайт</label>
          <input className="input" placeholder={`© ${new Date().getFullYear()} ООО Улыбка`} value={s.copyright} onChange={e => updateSettings({ copyright: e.target.value })} />
        </div>
        <div>
          <label className="label">Ниша — шаблон ключевых слов</label>
          <select className="input" value={s.niche} onChange={e => loadNiche(e.target.value)}>
            <option value="">— выберите нишу —</option>
            {NICHES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">GPS (опционально — из Яндекс Геокодер)</label>
          <input className="input" placeholder="55.7558, 37.6176" value={s.gpsLat ? `${s.gpsLat}, ${s.gpsLon}` : ''}
            onChange={e => {
              const [lat, lon] = e.target.value.split(',').map(Number)
              if (!isNaN(lat) && !isNaN(lon)) updateSettings({ gpsLat: lat, gpsLon: lon })
            }} />
        </div>
        <div className="col-span-2">
          <label className="label">
            Ключевые слова
            <span className="normal-case font-normal tracking-normal text-txt-3 ml-1">(из ниши, редактируемые — каждое с новой строки)</span>
          </label>
          <textarea className="input font-mono text-xs leading-loose min-h-[90px]"
            placeholder="Выберите нишу выше или введите вручную..."
            value={s.keywords.join('\n')}
            onChange={e => updateSettings({ keywords: e.target.value.split('\n').filter(Boolean) })} />
        </div>
      </div>

      {/* KW preview */}
      {niche && (
        <div className="bg-bg-2 border border-border rounded-xl p-4 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-txt-3 mb-3">Предпросмотр — IPTC Keywords</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-[10px] text-txt-3 mb-2">// кириллица (Яндекс)</div>
              <div className="flex flex-wrap gap-1">{niche.ru.map(k => <span key={k} className="font-mono text-[11px] bg-bg-3 border border-border rounded px-2 py-0.5 text-txt-2">{k}</span>)}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-txt-3 mb-2">// латиница (Google)</div>
              <div className="flex flex-wrap gap-1">{niche.en.map(k => <span key={k} className="font-mono text-[11px] bg-accent/5 border border-accent/20 rounded px-2 py-0.5 text-accent/80">{k}</span>)}</div>
            </div>
          </div>
        </div>
      )}

      {/* GEO SEO preview */}
      {geoVars.length > 0 && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-accent mb-2">GEO SEO — автогенерация вариантов</div>
          <div className="grid grid-cols-2 gap-1">
            {geoVars.map(v => <div key={v} className="font-mono text-[12px] text-txt-2">→ {v}</div>)}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-border">
        <button onClick={() => setAppStep('upload')} className="btn btn-ghost">← Назад</button>
        <button
          onClick={() => { if (!canSubmit) { showToast('Заполните название и адрес', 'err'); return } setAppStep('process') }}
          disabled={!canSubmit}
          className={clsx('btn btn-primary btn-lg', !canSubmit && 'opacity-40 cursor-not-allowed')}>
          Обработать {files.length} фото →
        </button>
      </div>
    </div>
  )
}
