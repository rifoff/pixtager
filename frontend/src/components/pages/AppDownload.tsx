// src/components/pages/AppDownload.tsx
'use client'
import { useStore } from '@/lib/store'
import { showToast } from '@/components/ui'

export function AppDownload() {
  const { processedFiles, zipUrl, settings: s, resetWizard } = useStore()

  function downloadZip() {
    if (!zipUrl) return showToast('Архив ещё не готов', 'err')
    const a = document.createElement('a')
    a.href = zipUrl
    a.download = `pixtager-${(s.businessName || 'optimized').replace(/\s+/g,'-').toLowerCase()}.zip`
    a.click()
    showToast('ZIP-архив скачивается...', 'ok')
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-ok/10 border border-ok/30 flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-2">Фотографии готовы!</h1>
        <p className="text-txt-2 text-sm mb-7">
          SEO-метаданные прошиты в {processedFiles.length} {processedFiles.length === 1 ? 'файл' : 'файлов'}. Ссылка действительна 24 часа.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={downloadZip} className="btn btn-primary btn-lg gap-3">↓ Скачать ZIP-архив</button>
          <button onClick={resetWizard} className="btn btn-ghost btn-lg">Новая обработка</button>
        </div>
      </div>

      {/* Results grid */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2">Результаты</div>
        <div className="font-mono text-xs text-txt-3">{processedFiles.length} файлов · {s.mode}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {processedFiles.map((f, i) => (
          <div key={i} className="card-sm flex flex-col gap-1.5">
            <div className="font-mono text-[11px] text-txt-3 truncate">{f.originalName}</div>
            <div className="font-mono text-[12px] text-ok font-semibold truncate">→ {f.seoName}</div>
            <div className="h-px bg-border my-1" />
            <div className="text-[11px] text-txt-3 leading-relaxed">
              <span className="text-txt-2">ALT: </span>{f.altTag}
            </div>
          </div>
        ))}
      </div>

      {/* Meta summary */}
      <div className="card">
        <div className="text-[11px] font-bold uppercase tracking-widest text-txt-3 mb-4">Что прошито в метаданные</div>
        <div className="font-mono text-[12px] text-txt-2 leading-[2.2] grid grid-cols-1 sm:grid-cols-2 gap-x-10">
          <div><span className="text-txt-3">IPTC:Title     </span>→ {s.businessName}</div>
          <div><span className="text-txt-3">IPTC:City      </span>→ {s.city}</div>
          <div><span className="text-txt-3">IPTC:Country   </span>→ {s.country}</div>
          <div><span className="text-txt-3">IPTC:Author    </span>→ {s.author || '(не задан)'}</div>
          <div><span className="text-txt-3">IPTC:Copyright </span>→ {s.copyright || '(не задан)'}</div>
          <div><span className="text-txt-3">IPTC:Keywords  </span>→ {s.keywords.slice(0, 4).join(', ')}…</div>
          <div><span className="text-txt-3">EXIF:GPS       </span>→ из адреса (Яндекс Геокодер)</div>
          <div><span className="text-txt-3">SEO Mode       </span>→ {s.mode}</div>
        </div>
      </div>

      {/* Archive contents */}
      <div className="mt-4 bg-bg-2 border border-border rounded-xl p-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-txt-3 mb-3">ZIP содержит</div>
        <div className="flex flex-wrap gap-2">
          {processedFiles.map((f, i) => (
            <span key={i} className="font-mono text-[11px] bg-bg-3 border border-border rounded px-2 py-0.5 text-ok">{f.seoName}</span>
          ))}
          <span className="font-mono text-[11px] bg-accent/10 border border-accent/30 rounded px-2 py-0.5 text-accent">seo-metadata.html</span>
          <span className="font-mono text-[11px] bg-accent/10 border border-accent/30 rounded px-2 py-0.5 text-accent">seo-report.csv</span>
        </div>
      </div>
    </div>
  )
}
