'use client'
import { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pixtager.ru/api-backend'

const PLANS = ['FREE', 'STARTER', 'PRO', 'AGENCY']

const MODE_SHORT: Record<string, string> = {
  YANDEX_MAPS: 'Я.Карты', YANDEX_IMAGES: 'Я.Картинки', GOOGLE_MAPS: 'G.Maps', GEO_SEO: 'GEO SEO',
}

interface Stats {
  totalUsers: number
  totalJobs: number
  totalFiles: number
  recentUsers: number
  planCounts: { plan: string; count: number }[]
}

interface User {
  id: string
  email: string
  plan: string
  quotaUsed: number
  jobsCount: number
  createdAt: string
}

interface Job {
  id: string
  status: string
  totalFiles: number
  businessName: string
  mode: string
  userEmail: string
  createdAt: string
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'stats' | 'users' | 'jobs'>('stats')
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  const headers = { 'x-admin-secret': secret, 'Content-Type': 'application/json' }

  async function login() {
    setLoading(true)
    const res = await fetch(`${API}/admin/stats`, { headers })
    if (res.ok) {
      const data = await res.json()
      setStats(data)
      setAuthed(true)
      setError('')
    } else {
      setError('Неверный пароль')
    }
    setLoading(false)
  }

  async function loadUsers() {
    setLoading(true)
    const res = await fetch(`${API}/admin/users`, { headers })
    setUsers(await res.json())
    setLoading(false)
  }

  async function loadJobs() {
    setLoading(true)
    const res = await fetch(`${API}/admin/jobs`, { headers })
    setJobs(await res.json())
    setLoading(false)
  }

  async function changePlan(userId: string, plan: string) {
    await fetch(`${API}/admin/users/${userId}/plan`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ plan }),
    })
    loadUsers()
  }

  useEffect(() => {
    if (!authed) return
    if (tab === 'users') loadUsers()
    if (tab === 'jobs') loadJobs()
  }, [tab, authed])

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')

  if (!authed) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="bg-bg-2 border border-border rounded-2xl p-8 w-full max-w-sm">
        <div className="text-xl font-bold mb-6 text-center">Админ панель</div>
        <input
          type="password"
          placeholder="Пароль"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm mb-3 outline-none focus:border-accent"
        />
        {error && <div className="text-danger text-sm mb-3">{error}</div>}
        <button onClick={login} disabled={loading}
          className="btn btn-primary w-full">
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg text-txt">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">PixTager Admin</div>
        <button onClick={() => setAuthed(false)} className="text-sm text-txt-3 hover:text-txt">Выйти</button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['stats', 'users', 'jobs'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                tab === t ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-bg-2 text-txt-3'
              }`}>
              {{ stats: 'Статистика', users: 'Пользователи', jobs: 'Задания' }[t]}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 'stats' && stats && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { val: stats.totalUsers, label: 'Пользователей' },
                { val: stats.recentUsers, label: 'За 7 дней' },
                { val: stats.totalJobs, label: 'Заданий' },
                { val: stats.totalFiles, label: 'Фото обработано' },
              ].map(s => (
                <div key={s.label} className="bg-bg-2 border border-border rounded-xl p-5">
                  <div className="font-mono text-3xl font-bold text-accent">{s.val}</div>
                  <div className="text-[11px] text-txt-3 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="text-sm font-semibold mb-4">Тарифы</div>
              {stats.planCounts.map(p => (
                <div key={p.plan} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-mono text-sm">{p.plan}</span>
                  <span className="font-mono text-accent font-bold">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
            {loading ? <div className="p-8 text-center text-txt-3">Загрузка...</div> : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Email', 'Тариф', 'Квота', 'Заданий', 'Регистрация', 'Изменить тариф'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-txt-3 px-4 py-3 border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-bg-3 transition-colors">
                      <td className="px-4 py-3 border-b border-border text-sm">{u.email}</td>
                      <td className="px-4 py-3 border-b border-border">
                        <span className="font-mono text-xs bg-accent/10 text-accent px-2 py-1 rounded">{u.plan}</span>
                      </td>
                      <td className="px-4 py-3 border-b border-border font-mono text-sm text-txt-3">{u.quotaUsed}</td>
                      <td className="px-4 py-3 border-b border-border font-mono text-sm text-txt-3">{u.jobsCount}</td>
                      <td className="px-4 py-3 border-b border-border font-mono text-xs text-txt-3">{fmtDate(u.createdAt)}</td>
                      <td className="px-4 py-3 border-b border-border">
                        <select value={u.plan} onChange={e => changePlan(u.id, e.target.value)}
                          className="bg-bg border border-border rounded px-2 py-1 text-xs text-txt">
                          {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Jobs */}
        {tab === 'jobs' && (
          <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
            {loading ? <div className="p-8 text-center text-txt-3">Загрузка...</div> : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Пользователь', 'Бизнес', 'Файлов', 'Режим', 'Статус', 'Дата'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-txt-3 px-4 py-3 border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id} className="hover:bg-bg-3 transition-colors">
                      <td className="px-4 py-3 border-b border-border text-xs text-txt-3">{j.userEmail}</td>
                      <td className="px-4 py-3 border-b border-border text-sm">{j.businessName || '—'}</td>
                      <td className="px-4 py-3 border-b border-border font-mono text-sm text-accent">{j.totalFiles}</td>
                      <td className="px-4 py-3 border-b border-border text-xs text-txt-3">{MODE_SHORT[j.mode] || j.mode || '—'}</td>
                      <td className="px-4 py-3 border-b border-border">
                        <span className={`text-xs font-mono px-2 py-1 rounded ${j.status === 'DONE' ? 'bg-ok/10 text-ok' : 'bg-accent/10 text-accent'}`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-border font-mono text-xs text-txt-3">{fmtDate(j.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}