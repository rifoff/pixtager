'use client'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { PLANS } from '@/lib/constants'
import { AppUpload }   from './AppUpload'
import { AppSettings } from './AppSettings'
import { AppProcess }  from './AppProcess'
import { AppDownload } from './AppDownload'
import clsx from 'clsx'

const STEPS = [
  { id: 'upload',   label: 'Загрузка'      },
  { id: 'settings', label: 'Настройки SEO' },
  { id: 'process',  label: 'Обработка'     },
  { id: 'download', label: 'Скачать'       },
] as const

type StepId = typeof STEPS[number]['id']

export function AppShell() {
  const { user, appStep, setAppStep, files } = useStore()
  const planKey = ((user?.plan ?? 'FREE').toUpperCase()) as keyof typeof PLANS
  const quota = PLANS[planKey]?.quota ?? 10

  const stepIdx = STEPS.findIndex(s => s.id === appStep)

  function canNav(id: StepId) {
    const idx = STEPS.findIndex(s => s.id === id)
    if (id === 'process' || id === 'download') return false
    return idx <= stepIdx
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Topbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-7 h-[52px] border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-txt-2 hover:text-txt transition-colors text-sm flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg hover:border-border-2">
            ← Кабинет
          </Link>
          <span className="font-bold text-txt">● Pix<span className="font-light">Tager</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="font-mono text-[11px] text-txt-3">{files.length} / {quota} фото</span>
            <div className="w-20 h-[3px] bg-bg-3 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: Math.min(100, files.length / quota * 100) + '%' }} />
            </div>
          </div>
          {user ? (
            <Link href="/dashboard" className="font-mono text-[11px] font-bold px-3 py-1.5 rounded bg-accent/10 text-accent border border-accent/25 hover:bg-accent/20 transition-colors">
              {user.plan === 'FREE' ? 'Бесплатный ↑' : user.plan}
            </Link>
          ) : (
            <Link href="/auth" className="btn btn-primary btn-sm">Войти</Link>
          )}
        </div>
      </header>

      {/* Step nav */}
      <nav className="flex items-center border-b border-border bg-bg-2 overflow-x-auto">
        {STEPS.map((step, i) => {
          const isActive = appStep === step.id
          const isDone   = i < stepIdx
          return (
            <button key={step.id}
              onClick={() => canNav(step.id) && setAppStep(step.id)}
              className={clsx(
                'flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium whitespace-nowrap',
                'border-b-2 transition-colors duration-150',
                isActive  && 'text-txt border-accent',
                isDone    && 'text-ok border-transparent cursor-pointer hover:text-ok',
                !isActive && !isDone && 'text-txt-3 border-transparent cursor-default',
              )}>
              <span className={clsx(
                'w-5 h-5 rounded-full flex items-center justify-center',
                'font-mono text-[10px] font-bold transition-all duration-150',
                isActive  && 'bg-accent text-black',
                isDone    && 'bg-ok/15 border border-ok/40 text-ok',
                !isActive && !isDone && 'bg-bg-3 border border-border text-txt-3',
              )}>
                {isDone ? '✓' : i + 1}
              </span>
              {step.label}
            </button>
          )
        })}
      </nav>

      {/* Page content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-7 py-8">
        {appStep === 'upload'   && <AppUpload />}
        {appStep === 'settings' && <AppSettings />}
        {appStep === 'process'  && <AppProcess />}
        {appStep === 'download' && <AppDownload />}
      </main>
    </div>
  )
}
