// src/components/pages/AppProcess.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { startJob, pollJob } from '@/lib/api'
import { ProgressBar } from '@/components/ui'
import clsx from 'clsx'

const STEP_LABELS = [
  'Загрузка файлов на сервер',
  'Геокодирование адреса',
  'Генерация SEO-данных',
  'Прошивка метаданных (exiftool)',
  'Упаковка ZIP-архива',
]

type StepState = 'idle' | 'active' | 'done'

export function AppProcess() {
  const { files, settings, user, setAppStep, setJobId, setJobStatus, setProcessedFiles, setZipUrl, jobId } = useStore()
  const [stepStates, setStepStates] = useState<StepState[]>(Array(5).fill('idle'))
  const [totalPct, setTotalPct] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString('ru')
    setLog(prev => [...prev, `[${ts}] ${msg}`])
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, 30)
  }

  const tick = (i: number, state: StepState) =>
    setStepStates(prev => prev.map((v, idx) => idx === i ? state : v))

  useEffect(() => {
    if (started.current) return
    started.current = true
    runProcessing()
  }, [])

  async function runProcessing() {
    try {
      // Step 1: Upload
      tick(0, 'active')
      addLog(`Загрузка ${files.length} файлов на сервер...`)
      setTotalPct(5)

      const userId = user?.id || user?.email || 'demo-user'
      const { jobId: newJobId } = await startJob(files, {
        businessName: settings.businessName,
        address: settings.address,
        city: settings.city,
        country: settings.country,
        author: settings.author,
        copyright: settings.copyright,
        niche: settings.niche,
        keywords: settings.keywords,
        mode: settings.mode,
        gpsLat: settings.gpsLat,
        gpsLon: settings.gpsLon,
      }, userId)

      setJobId(newJobId)
      setJobStatus('processing')
      addLog(`✓ Файлы загружены. Задание: ${newJobId.slice(0, 8)}...`)
      tick(0, 'done')
      setTotalPct(20)

      // Steps 2-5: Poll status
      tick(1, 'active')
      addLog('Обработка на сервере...')

      let attempts = 0
      const maxAttempts = 120 // 2 minutes

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 1000))
        attempts++

        const job = await pollJob(newJobId, userId)
        const pct = job.progress ?? 0

        // Update step indicators based on progress
        if (pct >= 20) { tick(1, 'done'); tick(2, 'active') }
        if (pct >= 40) { tick(2, 'done'); tick(3, 'active') }
        if (pct >= 80) { tick(3, 'done'); tick(4, 'active') }
        if (pct >= 100) { tick(4, 'done') }

        setTotalPct(20 + Math.round(pct * 0.8))

        if (job.processed > 0) {
          addLog(`Обработано файлов: ${job.processed} / ${job.totalFiles}`)
        }

        if (job.status === 'DONE') {
          addLog('✓ Обработка завершена!')
          setTotalPct(100)
          setJobStatus('done')
          setZipUrl(`/api-backend/jobs/${newJobId}/download`)
          if (job.files) {
            setProcessedFiles(job.files.map((f: any) => ({
              originalName: f.originalName,
              seoName: f.seoName || f.originalName,
              altTag: f.altTag || '',
              status: f.status,
            })))
          }
          await new Promise(r => setTimeout(r, 500))
          setAppStep('download')
          return
        }

        if (job.status === 'FAILED') {
          throw new Error('Обработка завершилась с ошибкой на сервере')
        }
      }

      throw new Error('Превышено время ожидания (2 минуты)')

    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка')
      setJobStatus('failed')
      addLog(`✗ Ошибка: ${err.message}`)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Обработка</h1>
      <p className="text-txt-2 text-sm mb-7">Прошиваем SEO-метаданные через exiftool на сервере.</p>

      {error && (
        <div className="mb-5 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-5">Прогресс</div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-txt">Общий прогресс</span>
              <span className="font-mono text-xs text-accent">{Math.round(totalPct)}%</span>
            </div>
            <ProgressBar pct={totalPct} color="accent" />
          </div>
          <div className="h-px bg-border mb-5" />
          <div className="flex flex-col gap-3">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={clsx(
                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                  'font-mono text-[9px] font-bold transition-all duration-300',
                  stepStates[i] === 'active' && 'bg-accent/15 border border-accent/40 text-accent',
                  stepStates[i] === 'done'   && 'bg-ok/15 border border-ok/40 text-ok',
                  stepStates[i] === 'idle'   && 'bg-bg-3 border border-border text-txt-3',
                )}>
                  {stepStates[i] === 'done' ? '✓' : stepStates[i] === 'active' ? '…' : i + 1}
                </div>
                <span className={clsx('text-sm transition-colors duration-200',
                  stepStates[i] === 'done'   && 'line-through text-txt-3',
                  stepStates[i] === 'active' && 'text-txt',
                  stepStates[i] === 'idle'   && 'text-txt-3',
                )}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-3">Лог обработки</div>
          <div ref={logRef} className="font-mono text-[11px] text-txt-3 leading-loose max-h-64 overflow-y-auto">
            {log.map((l, i) => (
              <div key={i} className={l.includes('✓') ? 'text-ok' : l.includes('✗') ? 'text-red-400' : ''}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
