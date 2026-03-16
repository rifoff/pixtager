// src/components/pages/AuthForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { Logo, showToast } from '@/components/ui'
import clsx from 'clsx'

type Tab = 'login' | 'reg'

export function AuthForm() {
  const [tab, setTab]           = useState<Tab>('login')
  const [email, setEmail]       = useState('')
  const [pass, setPass]         = useState('')
  const [pass2, setPass2]       = useState('')
  const [agree, setAgree]       = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const setUser = useStore(s => s.setUser)

  // Password strength
  const pwScore = (() => {
    let s = 0
    if (pass.length >= 8) s++
    if (/[A-Z]/.test(pass)) s++
    if (/[0-9]/.test(pass)) s++
    if (/[^A-Za-z0-9]/.test(pass)) s++
    return s
  })()
  const pwLevels = [
    { label: 'Слабый',   color: '#e05252' },
    { label: 'Средний',  color: '#e8b44a' },
    { label: 'Хороший',  color: '#4caf82' },
    { label: 'Надёжный', color: '#4caf82' },
  ]

  async function submit() {
    if (!email.trim()) return showToast('Введите email', 'err')
    if (!pass)         return showToast('Введите пароль', 'err')
    if (tab === 'reg') {
      if (pass !== pass2) return showToast('Пароли не совпадают', 'err')
      if (pass.length < 8) return showToast('Пароль минимум 8 символов', 'err')
      if (!agree) return showToast('Примите условия использования', 'err')
    }
    setLoading(true)
    // In production: POST /api/auth/login or /register
    await new Promise(r => setTimeout(r, 700))
    setUser({ id: 'demo', email, plan: 'FREE', quotaUsed: 0, token: 'demo-token' })
    showToast(tab === 'login' ? 'Добро пожаловать!' : 'Аккаунт создан! 🎉', 'ok')
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-[420px] relative z-10">
      <Link href="/" className="block mb-8"><Logo size="lg" className="justify-center" /></Link>

      <div className="bg-bg-2 border border-border rounded-2xl p-8">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-0 bg-bg-3 rounded-xl p-1 mb-7">
          {(['login','reg'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={clsx('py-2.5 text-[13px] font-semibold rounded-lg transition-all',
                tab === t ? 'bg-bg-2 text-txt shadow-sm' : 'text-txt-3 hover:text-txt-2')}>
              {t === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <>
            <div className="font-display text-xl font-bold tracking-tight mb-1">Добро пожаловать</div>
            <p className="text-txt-2 text-[13px] mb-6 leading-relaxed">Войдите в аккаунт, чтобы продолжить работу</p>
          </>
        ) : (
          <>
            <div className="font-display text-xl font-bold tracking-tight mb-1">Создать аккаунт</div>
            <p className="text-txt-2 text-[13px] mb-6 leading-relaxed">Бесплатно. Без карты. 10 фото сразу.</p>
          </>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="your@email.ru" value={email}
            onChange={e => setEmail(e.target.value)} autoComplete="email" />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="label">Пароль</label>
          <div className="relative">
            <input className="input pr-11" type={showPw ? 'text' : 'password'}
              placeholder={tab === 'reg' ? 'Минимум 8 символов' : 'Ваш пароль'}
              value={pass} onChange={e => setPass(e.target.value)}
              autoComplete={tab === 'reg' ? 'new-password' : 'current-password'} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-3 hover:text-txt-2 text-base transition-colors">
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
          {/* Strength indicator */}
          {tab === 'reg' && pass && (
            <div className="mt-2">
              <div className="h-[3px] bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: (pwScore / 4 * 100) + '%', background: pwLevels[Math.max(0, pwScore - 1)]?.color }} />
              </div>
              <div className="text-[11px] mt-1" style={{ color: pwLevels[Math.max(0, pwScore - 1)]?.color }}>
                {pwLevels[Math.max(0, pwScore - 1)]?.label}
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        {tab === 'reg' && (
          <div className="mb-4">
            <label className="label">Подтвердите пароль</label>
            <div className="relative">
              <input className="input pr-11" type={showPw ? 'text' : 'password'}
                placeholder="Повторите пароль" value={pass2} onChange={e => setPass2(e.target.value)}
                autoComplete="new-password" />
            </div>
          </div>
        )}

        {/* Forgot password */}
        {tab === 'login' && (
          <div className="text-right mb-4 -mt-1">
            <span className="text-[12px] text-accent cursor-pointer hover:underline">Забыли пароль?</span>
          </div>
        )}

        {/* Agree */}
        {tab === 'reg' && (
          <div className="flex items-start gap-2.5 mb-5 text-[12px] text-txt-2">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
              className="mt-0.5 flex-shrink-0 accent-accent" />
            <label>Принимаю <span className="text-accent cursor-pointer">условия использования</span> и{' '}
              <span className="text-accent cursor-pointer">политику конфиденциальности</span></label>
          </div>
        )}

        {/* Submit */}
        <button onClick={submit} disabled={loading}
          className={clsx('btn btn-primary w-full justify-center py-3 text-[14px]', loading && 'opacity-60 cursor-not-allowed')}>
          {loading ? '...' : tab === 'login' ? 'Войти →' : 'Создать аккаунт →'}
        </button>

        {/* Free plan perks (register only) */}
        {tab === 'reg' && (
          <div className="mt-5 bg-accent/8 border border-accent/20 rounded-xl p-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent mb-3">Бесплатный тариф включает</div>
            {['10 фото в месяц бесплатно','IPTC-метаданные + GPS в EXIF','SEO-имена файлов','ZIP-архив с HTML-отчётом'].map(f => (
              <div key={f} className="flex items-center gap-2 text-[12px] text-txt-2 mb-1.5">
                <span className="text-ok font-bold text-[11px]">✓</span>{f}
              </div>
            ))}
          </div>
        )}

        {/* Switch tab hint */}
        <div className="mt-5 text-center text-[12px] text-txt-3">
          {tab === 'login'
            ? <>Нет аккаунта? <span className="text-accent cursor-pointer" onClick={() => setTab('reg')}>Зарегистрируйтесь бесплатно</span></>
            : <>Уже есть аккаунт? <span className="text-accent cursor-pointer" onClick={() => setTab('login')}>Войти</span></>
          }
        </div>
      </div>
    </div>
  )
}
