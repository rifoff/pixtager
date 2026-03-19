// src/components/pages/DashboardProfile.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { NICHES } from '@/lib/niches'
import { SEO_MODES } from '@/lib/constants'
import { showToast } from '@/components/ui'

export function DashboardProfile() {
  const { user, setUser, logout, updateSettings, settings } = useStore()
  const router = useRouter()

  const [email,          setEmail]          = useState(user?.email ?? '')
  const [name,           setName]           = useState(user?.name  ?? '')
  const [oldPw,          setOldPw]          = useState('')
  const [newPw,          setNewPw]          = useState('')
  const [newPw2,         setNewPw2]         = useState('')
  const [showPw,         setShowPw]         = useState(false)
  const [defaultNiche,   setDefaultNiche]   = useState(settings.niche    || '')
  const [defaultMode,    setDefaultMode]    = useState(settings.mode      || 'YANDEX_MAPS')
  const [defaultAuthor,  setDefaultAuthor]  = useState(settings.author    || '')
  const [defaultCountry, setDefaultCountry] = useState(settings.country   || 'Россия')

  if (!user) return null

  const initials = email.slice(0, 2).toUpperCase()

  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pixtager.ru/api-backend'

  async function saveProfile() {
    if (!email.trim()) return showToast('Email обязателен', 'err')
    const res = await fetch(`${API}/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
      body: JSON.stringify({ email, name }),
    })
    if (res.ok) {
      setUser({ ...user, email, name })
      showToast('Профиль сохранён', 'ok')
    } else {
      const data = await res.json()
      showToast(data.error || 'Ошибка сохранения', 'err')
    }
  }

  async function changePassword() {
    if (!oldPw || !newPw || !newPw2) return showToast('Заполните все поля пароля', 'err')
    if (newPw !== newPw2) return showToast('Новые пароли не совпадают', 'err')
    if (newPw.length < 8) return showToast('Пароль минимум 8 символов', 'err')
    const res = await fetch(`${API}/auth/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
    })
    if (res.ok) {
      setOldPw(''); setNewPw(''); setNewPw2('')
      showToast('Пароль изменён', 'ok')
    } else {
      const data = await res.json()
      showToast(data.error || 'Ошибка смены пароля', 'err')
    }
  }

  function saveDefaults() {
  updateSettings({
    niche: defaultNiche,
    mode: defaultMode as any,
    author: defaultAuthor,
    country: defaultCountry,
  })
  showToast('Настройки по умолчанию сохранены', 'ok')
}

  function deleteAccount() {
    if (!confirm('Удалить аккаунт безвозвратно? Все данные и история будут потеряны.')) return
    logout()
    showToast('Аккаунт удалён', 'err')
    setTimeout(() => router.push('/'), 800)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-7">Профиль</h1>

      {/* Avatar + plan pill */}
      <div className="flex items-center gap-4 bg-bg-2 border border-border rounded-xl p-5 mb-7">
        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center font-mono text-xl font-bold text-accent flex-shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-[15px] font-semibold">{name || email}</div>
          <div className="text-[13px] text-txt-2">{email}</div>
          <span className="badge badge-accent mt-1.5">{user.plan}</span>
        </div>
      </div>

      {/* Personal data */}
      <SectionTitle>Личные данные</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Имя / компания</label>
          <input className="input" type="text" placeholder="Иванов Иван / ООО Улыбка" value={name} onChange={e => setName(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-secondary" onClick={saveProfile}>Сохранить изменения</button>

      <div className="divider" />

      {/* Password */}
      <SectionTitle>Изменить пароль</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Текущий пароль</label>
          <PwField value={oldPw} onChange={setOldPw} show={showPw} toggle={() => setShowPw(!showPw)} placeholder="Текущий пароль" />
        </div>
        <div />
        <div>
          <label className="label">Новый пароль</label>
          <PwField value={newPw} onChange={setNewPw} show={showPw} toggle={() => setShowPw(!showPw)} placeholder="Минимум 8 символов" />
        </div>
        <div>
          <label className="label">Подтвердите новый пароль</label>
          <PwField value={newPw2} onChange={setNewPw2} show={showPw} toggle={() => setShowPw(!showPw)} placeholder="Повторите пароль" />
        </div>
      </div>
      <button className="btn btn-secondary" onClick={changePassword}>Изменить пароль</button>

      <div className="divider" />

      {/* Defaults */}
      <SectionTitle>Настройки по умолчанию</SectionTitle>
      <p className="text-[13px] text-txt-2 mb-4">Эти значения будут предзаполнены при каждом новом задании.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Ниша по умолчанию</label>
          <select className="input" value={defaultNiche} onChange={e => setDefaultNiche(e.target.value)}>
            <option value="">— не задана —</option>
            {NICHES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">SEO-режим по умолчанию</label>
          <select className="input" value={defaultMode} onChange={e => setDefaultMode(e.target.value)}>
            {Object.entries(SEO_MODES).map(([k, m]) => (
              <option key={k} value={k}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Автор по умолчанию</label>
          <input className="input" type="text" placeholder="Ваше имя или бренд" value={defaultAuthor} onChange={e => setDefaultAuthor(e.target.value)} />
        </div>
        <div>
          <label className="label">Страна</label>
          <input className="input" type="text" value={defaultCountry} onChange={e => setDefaultCountry(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-secondary" onClick={saveDefaults}>Сохранить настройки</button>

      <div className="divider" />

      {/* Danger zone */}
      <SectionTitle danger>Опасная зона</SectionTitle>
      <div className="border border-danger/20 rounded-xl p-5">
        <div className="text-[13px] font-semibold mb-1.5">Удалить аккаунт</div>
        <div className="text-[12px] text-txt-3 mb-4 max-w-md leading-relaxed">
          Все данные, история заданий и настройки будут удалены безвозвратно. Действие невозможно отменить.
        </div>
        <button className="btn btn-danger btn-sm" onClick={deleteAccount}>Удалить аккаунт</button>
      </div>
    </div>
  )
}

function SectionTitle({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`text-[13px] font-semibold uppercase tracking-widest mb-4 ${danger ? 'text-danger' : 'text-txt-2'}`}>
      {children}
    </div>
  )
}

function PwField({ value, onChange, show, toggle, placeholder }: {
  value: string; onChange: (v: string) => void
  show: boolean; toggle: () => void; placeholder: string
}) {
  return (
    <div className="relative">
      <input className="input pr-11" type={show ? 'text' : 'password'}
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      <button type="button" onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-3 hover:text-txt-2 text-base transition-colors">
        {show ? '🙈' : '👁'}
      </button>
    </div>
  )
}
