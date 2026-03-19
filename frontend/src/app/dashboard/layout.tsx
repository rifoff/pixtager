'use client'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import clsx from 'clsx'
import Image from 'next/image'
import { ToastProvider } from '@/components/ui'


const NAV = [
  { href: '/dashboard',         icon: '◆', label: 'Обзор'         },
  { href: '/dashboard/jobs',    icon: '≡', label: 'Задания'       },
  { href: '/dashboard/billing', icon: '₽', label: 'Тариф и оплата'},
  { href: '/dashboard/profile', icon: '◎', label: 'Профиль'       },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, setUser } = useStore()
  const router       = useRouter()
  const pathname     = usePathname()

  useEffect(() => {
    if (!user) router.replace('/auth')
  }, [user, router])

  useEffect(() => {
    if (!user?.id) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://pixtager.ru/api-backend'}/auth/me`, {
      headers: { 'x-user-id': user.id },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setUser({ ...user, email: data.email, name: data.name, quotaUsed: data.quotaUsed })
      })
      .catch(() => {})
  }, [])

  if (!user) return null

  const initials = user.email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen flex flex-col bg-bg">

      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-[52px] border-b border-border bg-bg/90 backdrop-blur-xl">
        <Link href="/">
        <Image src="/logo.svg" alt="PixTager" width={110} height={36} priority />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-bg-2 border border-border rounded-lg px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center font-mono text-[10px] text-accent">
              {initials}
            </div>
            <div>
              <div className="text-[12px] text-txt-2 leading-none">{user.email}</div>
              <div className="font-mono text-[10px] font-bold text-accent leading-none mt-0.5">{user.plan}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[210px] flex-shrink-0 border-r border-border bg-bg-2 flex flex-col gap-1 px-3 py-4 sticky top-[52px] h-[calc(100vh-52px)]">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150',
                  active ? 'bg-bg-4 text-txt' : 'text-txt-3 hover:bg-bg-3 hover:text-txt-2',
                )}>
                <span className="text-[15px] w-5 text-center flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          <div className="mt-auto pt-4 border-t border-border flex flex-col gap-1">
            <Link href="/app"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-accent hover:bg-accent/8 transition-all">
              <span className="text-[15px] w-5 text-center">→</span>
              Открыть приложение
            </Link>
            <button onClick={() => { logout(); router.push('/auth') }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-txt-3 hover:bg-bg-3 hover:text-txt-2 w-full text-left">
              <span className="text-[15px] w-5 text-center">←</span>
              Выйти
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-8 py-8 bg-bg">
          <ToastProvider />
          {children}
        </main>
      </div>
    </div>
  )
}