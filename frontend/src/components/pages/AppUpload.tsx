// src/components/pages/AppUpload.tsx
'use client'
import { useCallback } from 'react'
import { useStore } from '@/lib/store'
import { PLANS } from '@/lib/constants'
import { showToast } from '@/components/ui'
import clsx from 'clsx'

export function AppUpload() {
  const { files, addFiles, removeFile, clearFiles, setAppStep, user } = useStore()
  const planKey = ((user?.plan ?? 'FREE').toUpperCase()) as keyof typeof PLANS
  const quota = PLANS[planKey]?.quota ?? 10

  const handleFiles = useCallback((list: FileList | File[]) => {
    const valid = Array.from(list).filter(f => {
      if (!['image/jpeg','image/png'].includes(f.type)) { showToast('Поддерживаются только JPG и PNG', 'err'); return false }
      if (f.size > 15 * 1024 * 1024) { showToast(`${f.name} превышает 15 МБ`, 'err'); return false }
      return true
    })
    addFiles(valid)
  }, [addFiles])

  const pct = Math.min(100, Math.round(files.length / quota * 100))

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Загрузите фотографии</h1>
      <p className="text-txt-2 text-sm mb-7">Перетащите или выберите файлы. {user?.plan === 'FREE' ? 'Бесплатный тариф — до 10 фото.' : `Тариф ${user?.plan} — до ${quota} фото.`}</p>

      {/* Drop zone */}
      <label
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        onDragOver={e => e.preventDefault()}
        className="group relative flex flex-col items-center justify-center gap-3 border-[1.5px] border-dashed border-border-2 rounded-xl bg-bg-2 hover:bg-accent/[.025] hover:border-accent transition-all duration-200 cursor-pointer p-14 text-center">
        <input type="file" multiple accept=".jpg,.jpeg,.png" className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={e => e.target.files && handleFiles(e.target.files)} />
        <div className="w-14 h-14 rounded-xl border-[1.5px] border-dashed border-border-2 group-hover:border-accent group-hover:text-accent flex items-center justify-center text-3xl text-txt-3 transition-all duration-200">+</div>
        <div>
          <div className="text-base font-semibold mb-1">Перетащите фото сюда</div>
          <div className="text-txt-2 text-sm">или нажмите для выбора файлов</div>
        </div>
        <div className="flex gap-2 mt-1">
          {['JPG','JPEG','PNG','до 15 МБ'].map(f => (
            <span key={f} className="font-mono text-[11px] bg-bg-3 border border-border rounded px-2 py-0.5 text-txt-2">{f}</span>
          ))}
        </div>
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-txt-2">Файлы в очереди</span>
            <span className="font-mono text-[12px] text-accent">{files.length} {plur(files.length)}</span>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            {files.map((f, i) => <FileRow key={i} file={f} index={i} onRemove={() => removeFile(i)} />)}
          </div>

          <div className="flex justify-between text-[11px] text-txt-3 mb-1">
            <span>Квота</span><span>{files.length} / {quota}</span>
          </div>
          <div className="h-[3px] bg-bg-3 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: pct + '%' }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-border">
        <button onClick={clearFiles} disabled={!files.length} className={clsx('btn btn-ghost', !files.length && 'opacity-40 cursor-not-allowed')}>
          Очистить всё
        </button>
        <button
          onClick={() => { if (!files.length) { showToast('Сначала загрузите фотографии', 'err'); return } setAppStep('settings') }}
          disabled={!files.length}
          className={clsx('btn btn-primary btn-lg', !files.length && 'opacity-40 cursor-not-allowed')}>
          Далее: Настройки SEO →
        </button>
      </div>
    </div>
  )
}

function FileRow({ file, index, onRemove }: { file: File; index: number; onRemove: () => void }) {
  const url = typeof window !== 'undefined' ? URL.createObjectURL(file) : ''
  return (
    <div className="grid grid-cols-[48px_1fr_auto_auto] items-center gap-3 px-3.5 py-2.5 bg-bg-2 border border-border rounded-lg hover:border-border-2 transition-colors">
      <div className="w-12 h-12 rounded bg-bg-3 border border-border overflow-hidden flex-shrink-0">
        {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{file.name}</div>
        <div className="text-txt-3 text-xs">{fmtSize(file.size)}</div>
      </div>
      <div className="hidden sm:block font-mono text-[11px] text-accent truncate max-w-[180px]">
        → seo-name-{index + 1}.jpg
      </div>
      <button onClick={onRemove} className="w-7 h-7 flex items-center justify-center rounded border border-border text-txt-3 hover:border-danger hover:text-danger transition-colors text-base flex-shrink-0">×</button>
    </div>
  )
}

const fmtSize = (b: number) => b < 1048576 ? Math.round(b/1024)+' КБ' : (b/1048576).toFixed(1)+' МБ'
const plur = (n: number) => n === 1 ? 'файл' : n < 5 ? 'файла' : 'файлов'
