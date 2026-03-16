// src/app/auth/page.tsx
import type { Metadata } from 'next'
import { AuthForm } from '@/components/pages/AuthForm'

export const metadata: Metadata = { title: 'Вход / Регистрация' }

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[.15] pointer-events-none"
        style={{ backgroundImage:'linear-gradient(#27272b 1px,transparent 1px),linear-gradient(90deg,#27272b 1px,transparent 1px)', backgroundSize:'50px 50px',
          maskImage:'radial-gradient(ellipse 70% 65% at 50% 50%,black 20%,transparent 100%)' }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[280px] pointer-events-none"
        style={{background:'radial-gradient(ellipse,rgba(232,180,74,0.07) 0%,transparent 70%)'}} />

      <AuthForm />

      <p className="mt-8 text-[12px] text-txt-3 text-center relative z-10">
        Данные хранятся в РФ · 152-ФЗ · Оплата через Т-Банк
      </p>
    </div>
  )
}
