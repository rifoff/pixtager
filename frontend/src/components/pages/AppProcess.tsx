// src/components/pages/AppProcess.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
import { useStore } from '@/lib/store'
import { generateAlt, generateGeoKeywords, getNiche } from '@/lib/niches'
import { SEO_MODES } from '@/lib/constants'
import { ProgressBar } from '@/components/ui'
import clsx from 'clsx'

type StepState = 'idle' | 'active' | 'done'

const STEP_LABELS = [
  'Подготовка настроек',
  'Геокодирование адреса',
  'Генерация SEO-данных',
  'Обработка файлов',
  'Упаковка ZIP-архива',
]

const TRANSLIT: Record<string,string> = {а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',' ':'-',',':''};
const toSlug = (s:string) => s.toLowerCase().split('').map(c=>TRANSLIT[c]??c).join('').replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'')
const NICHE_SLUG: Record<string,string> = {stom:'stomatologiya',cosmo:'kosmetologiya',realty:'nedvizhimost',rest:'restoran',hotel:'gostinitza',fitness:'fitnes',med:'klinika',law:'yurist',build:'stroitelstvo'}
const GPS_MAP: Record<string,[number,number]> = {москв:[55.7558,37.6176],петербург:[59.9343,30.3351],екатеринбург:[56.8389,60.6057],новосибирск:[54.9884,82.9357],казань:[55.7961,49.1063],краснодар:[45.0360,38.9754]}

export function AppProcess() {
  const { files, settings: s, setAppStep, setProcessedFiles, setZipUrl } = useStore()
  const [stepStates, setStepStates] = useState<StepState[]>(Array(5).fill('idle'))
  const [totalPct,   setTotalPct]   = useState(0)
  const [curPct,     setCurPct]     = useState(0)
  const [curFile,    setCurFile]    = useState<string>('—')
  const [done,       setDone]       = useState(0)
  const [log,        setLog]        = useState<string[]>([])
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
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

    // Step 1
    tick(0,'active'); addLog('Загрузка настроек...')
    await delay(280)
    addLog(`Режим: ${SEO_MODES[s.mode]?.label} | Ниша: ${getNiche(s.niche)?.name ?? '—'}`)
    setTotalPct(10); tick(0,'done')

    // Step 2
    tick(1,'active'); addLog(`Геокодирование адреса: "${s.address}"...`)
    await delay(450)
    const lc = s.address.toLowerCase()
    const gpsEntry = Object.entries(GPS_MAP).find(([k]) => lc.includes(k))
    const [lat, lon] = gpsEntry ? gpsEntry[1] : [55.7558, 37.6176]
    const gpsStr = `${lat}° с.ш., ${lon}° в.д.`
    addLog(`GPS: ${gpsStr}`)
    setTotalPct(25); tick(1,'done')

    // Step 3
    tick(2,'active'); addLog('Генерация SEO-данных...')
    await delay(200)
    const niche = getNiche(s.niche)
    const baseKw = s.keywords.length ? s.keywords : [...(niche?.ru ?? []), ...(niche?.en ?? [])]
    const geoKw  = s.mode === 'GEO_SEO' ? generateGeoKeywords(niche?.ru[0] ?? s.businessName, s.city) : []
    const allKw  = [...new Set([...baseKw, ...geoKw])]
    addLog(`Ключевых слов: ${allKw.length}`)
    setTotalPct(40); tick(2,'done')

    // Step 4
    tick(3,'active')
    const zip = new JSZip()
    const results: { originalName: string; seoName: string; altTag: string; status: string }[] = []

    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      setCurFile(f.name); setCurPct(0)
      addLog(`Обработка: ${f.name}`)
      await delay(60); setCurPct(40)

      const nichePart = s.niche && NICHE_SLUG[s.niche] ? NICHE_SLUG[s.niche] : toSlug(s.businessName).slice(0,20)
      const cityPart  = toSlug(s.city).slice(0,15)
      const parts     = [nichePart]; if (cityPart) parts.push(cityPart); if (i > 0) parts.push(String(i+1))
      const ext       = f.name.split('.').pop()?.toLowerCase() === 'png' ? 'png' : 'jpg'
      const seoName   = `${parts.join('-')}.${ext}`
      const altTag    = generateAlt(s.businessName, s.city, s.mode, s.niche)

      const buf = await new Promise<ArrayBuffer>((res, rej) => {
        const r = new FileReader(); r.onload = e => res(e.target!.result as ArrayBuffer); r.onerror = rej; r.readAsArrayBuffer(f)
      })
      zip.file(seoName, buf)

      setCurPct(100)
      results.push({ originalName: f.name, seoName, altTag, status: 'done' })
      setDone(i + 1)
      setTotalPct(40 + Math.round((i + 1) / files.length * 45))
      addLog(`✓ ${f.name} → ${seoName}`)
    }

    setProcessedFiles(results)
    tick(3,'done')

    // Step 5
    tick(4,'active'); addLog('Генерация отчётов...')
    zip.file('seo-metadata.html', buildHTML(results, s, gpsStr))
    zip.file('seo-report.csv',    buildCSV(results))
    await delay(200); addLog('Упаковка ZIP...')
    const blob = await zip.generateAsync({ type:'blob', compression:'DEFLATE' })
    const url  = URL.createObjectURL(blob)
    setZipUrl(url)
    setTotalPct(100); setCurPct(100)
    tick(4,'done'); addLog('✓ ZIP-архив готов!')

    await delay(650)
    setAppStep('download')
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Обработка</h1>
      <p className="text-txt-2 text-sm mb-7">Прошиваем SEO-метаданные и упаковываем архив.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Left: progress */}
        <div className="card">
          <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-5">Прогресс</div>
          <PBar label="Общий прогресс"   pct={totalPct} accent className="mb-4" />
          <PBar label={curFile}          pct={curPct}         className="mb-6" />
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

        {/* Right: stats + log */}
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-4">Итоги</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { val: files.length,                            label: 'Файлов всего',   accent: true },
                { val: done,                                    label: 'Обработано',     ok: true     },
                { val: SEO_MODES[s.mode]?.short ?? '—',        label: 'SEO режим'                    },
                { val: getNiche(s.niche)?.name ?? '—',         label: 'Ниша'                         },
              ].map(item => (
                <div key={item.label} className="bg-bg-3 rounded-lg p-3.5">
                  <div className={clsx('font-mono text-2xl font-bold', item.accent ? 'text-accent' : item.ok ? 'text-ok' : 'text-txt')}>{item.val}</div>
                  <div className="text-[11px] text-txt-3 uppercase tracking-widest mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card flex-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-3">Лог обработки</div>
            <div ref={logRef} className="font-mono text-[11px] text-txt-3 leading-loose max-h-44 overflow-y-auto">
              {log.map((l, i) => (
                <div key={i} className={l.includes('✓') ? 'text-ok' : ''}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PBar({ label, pct, accent, className }: { label: string; pct: number; accent?: boolean; className?: string }) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-txt truncate pr-4">{label}</span>
        <span className={clsx('font-mono text-xs', accent ? 'text-accent' : 'text-ok')}>{Math.round(pct)}%</span>
      </div>
      <ProgressBar pct={pct} color={accent ? 'accent' : 'ok'} />
    </div>
  )
}

function buildHTML(results: any[], s: any, gps: string) {
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>PixTager — Отчёт</title>
<style>body{font-family:-apple-system,sans-serif;background:#0a0a0b;color:#f2efe9;padding:32px}h1{font-size:22px;letter-spacing:-.03em;margin-bottom:6px}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#111113;border-radius:8px;padding:20px;margin:18px 0}.mi label{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#4a4850;display:block;margin-bottom:3px}.mi span{font-size:13px}table{width:100%;border-collapse:collapse;background:#111113;border-radius:8px;overflow:hidden}th{background:#222226;color:#e8b44a;padding:10px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.07em}td{padding:10px 16px;border-bottom:1px solid #27272b;font-size:13px}tr:last-child td{border:none}.g{color:#4caf82;font-weight:600;font-family:monospace}p{color:#4a4850;font-size:11px;margin-top:20px}</style></head><body>
<h1>PixTager — Отчёт по метаданным</h1>
<div class="meta"><div class="mi"><label>Бизнес</label><span>${s.businessName}</span></div><div class="mi"><label>Адрес</label><span>${s.address}</span></div><div class="mi"><label>Город</label><span>${s.city}</span></div><div class="mi"><label>Режим</label><span>${s.mode}</span></div><div class="mi"><label>GPS</label><span>${gps}</span></div><div class="mi"><label>Автор</label><span>${s.author||'—'}</span></div></div>
<table><thead><tr><th>Исходное имя</th><th>SEO имя</th><th>ALT тег</th><th>Статус</th></tr></thead><tbody>
${results.map(r=>`<tr><td>${r.originalName}</td><td class="g">${r.seoName}</td><td>${r.altTag}</td><td class="g">${r.status}</td></tr>`).join('')}
</tbody></table><p>Сгенерировано PixTager · ${new Date().toLocaleString('ru')}</p></body></html>`
}

function buildCSV(results: any[]) {
  return '\uFEFF' + 'Исходное имя,SEO имя,ALT тег,Статус\n' +
    results.map(r => `"${r.originalName}","${r.seoName}","${r.altTag}","${r.status}"`).join('\n')
}
