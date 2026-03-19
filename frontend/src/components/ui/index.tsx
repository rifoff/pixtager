// src/components/ui/index.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

// ── LOGO ─────────────────────────────────────────────────
import Image from 'next/image'

export function Logo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 80, md: 110, lg: 140 }
  return (
    <Image
      src="/logo.svg"
      alt="PixTager"
      width={sizes[size]}
      height={36}
      className={className}
      priority
    />
  )
}

// ── TOAST ─────────────────────────────────────────────────
type ToastType = 'ok' | 'err' | 'info'
let _toast: ((msg: string, type?: ToastType) => void) | null = null
export const showToast = (msg: string, type: ToastType = 'ok') => _toast?.(msg, type)

export function ToastProvider() {
  const [state, setState] = useState<{ msg: string; type: ToastType; visible: boolean }>({ msg: '', type: 'ok', visible: false })
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    _toast = (msg, type = 'ok') => {
      clearTimeout(timer.current)
      setState({ msg, type, visible: true })
      timer.current = setTimeout(() => setState(s => ({ ...s, visible: false })), 3000)
    }
    return () => { _toast = null }
  }, [])

  if (!state.visible) return null
  const colors: Record<ToastType, string> = {
    ok: 'bg-ok', err: 'bg-danger', info: 'bg-accent',
  }
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 bg-bg-3 border border-border-2 rounded-lg px-4 py-3 text-sm shadow-xl animate-fade-up max-w-xs">
      <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', colors[state.type])} />
      {state.msg}
    </div>
  )
}

// ── MODAL ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, subtitle, children }: {
  open: boolean; onClose: () => void
  title: string; subtitle?: string; children: React.ReactNode
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-5 animate-fade-up"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg-2 border border-border-2 rounded-2xl p-7 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-1">
          <div className="font-display text-lg font-bold tracking-tight">{title}</div>
          <button onClick={onClose} className="text-txt-3 hover:text-txt-2 text-2xl leading-none mt-0.5 transition-colors">×</button>
        </div>
        {subtitle && <div className="text-txt-2 text-sm mb-5 leading-relaxed">{subtitle}</div>}
        {children}
      </div>
    </div>
  )
}

// ── PROGRESS BAR ──────────────────────────────────────────
export function ProgressBar({ pct, color = 'accent', className }: { pct: number; color?: 'accent' | 'ok'; className?: string }) {
  return (
    <div className={clsx('h-1 bg-bg-3 rounded-full overflow-hidden', className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-400', color === 'accent' ? 'bg-accent' : 'bg-ok')}
        style={{ width: Math.min(100, Math.max(0, pct)) + '%' }}
      />
    </div>
  )
}

// ── STATUS BADGE ──────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    done:       { label: 'Готово',     cls: 'bg-ok/10 text-ok border border-ok/25' },
    processing: { label: 'Обработка', cls: 'bg-accent/10 text-accent border border-accent/25' },
    failed:     { label: 'Ошибка',    cls: 'bg-danger/10 text-danger border border-danger/25' },
    pending:    { label: 'В очереди', cls: 'bg-bg-3 text-txt-3 border border-border' },
  }
  const s = map[status] ?? map.pending
  return (
    <span className={clsx('inline-flex items-center gap-1.5 font-mono text-[10px] font-bold px-2.5 py-1 rounded', s.cls)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', status === 'processing' && 'animate-pulse',
        status === 'done' ? 'bg-ok' : status === 'failed' ? 'bg-danger' : status === 'processing' ? 'bg-accent' : 'bg-txt-3')} />
      {s.label}
    </span>
  )
}

// ── FIELD WRAPPER ─────────────────────────────────────────
export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
