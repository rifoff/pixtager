// src/components/pages/DashboardBilling.tsx
'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { PLANS } from '@/lib/constants'
import { Modal, showToast } from '@/components/ui'
import clsx from 'clsx'

const INVOICES = [
  { date:'01.03.2025', amount:'2 490 ₽', plan:'Про',  id:'INV-2503' },
  { date:'01.02.2025', amount:'2 490 ₽', plan:'Про',  id:'INV-2502' },
  { date:'01.01.2025', amount:'890 ₽',   plan:'Старт',id:'INV-2501' },
]

const PLAN_FEATURES: Record<string, string[]> = {
  FREE:    ['10 фото / месяц','1 шаблон ниши','IPTC + GPS + SEO-имя'],
  STARTER: ['100 фото / месяц','Все 9 ниш','ALT-теги','Яндекс + Google режим'],
  PRO:     ['1 000 фото / месяц','GEO SEO режим','Все 4 режима','Пакетная обработка'],
  AGENCY:  ['5 000+ фото / месяц','API-доступ','CSV-импорт','White-label ZIP'],
}

export function DashboardBilling() {
  const { user, setUser } = useStore()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selected, setSelected]       = useState<keyof typeof PLANS>('PRO')
  const [email, setEmail]             = useState(user?.email ?? '')
  const [paying, setPaying]           = useState(false)

  if (!user) return null
  const plan = PLANS[user.plan]

  async function handlePay() {
    if (!email.trim()) return showToast('Введите email для чека', 'err')
    setPaying(true)
    await new Promise(r => setTimeout(r, 800))
    setPaying(false)
    setUpgradeOpen(false)
    // In production: POST /api/payments/init → redirect to Tinkoff PaymentURL
    showToast(`Перенаправляем на страницу оплаты Т-Банк... (${PLANS[selected].name})`, 'ok')
  }

  function handleCancel() {
    if (!confirm('Отменить подписку? Доступ сохранится до конца оплаченного периода.')) return
    setUser({ ...user, plan: 'FREE' })
    showToast('Подписка отменена. Доступ до 01.04.2025', 'ok')
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-7">Тариф и оплата</h1>

      {/* Current plan highlight */}
      <div className="flex items-center justify-between bg-gradient-to-r from-accent/5 to-transparent border border-accent/20 rounded-xl px-6 py-5 mb-5">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent mb-2">Текущий тариф</div>
          <div className="font-display text-xl font-bold tracking-tight">{plan.name}</div>
          <div className="text-[13px] text-txt-2 mt-1">{plan.priceStr} {user.plan !== 'FREE' ? '/ месяц' : ''}</div>
          <div className="text-[12px] text-txt-3 mt-1">
            {user.plan === 'FREE' ? 'Подписка не активна' : 'Следующее списание: 01.04.2025'}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn btn-primary" onClick={() => setUpgradeOpen(true)}>Улучшить тариф ↑</button>
          {user.plan !== 'FREE' && (
            <button className="btn btn-danger btn-sm" onClick={handleCancel}>Отменить подписку</button>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Следующее списание', val: user.plan === 'FREE' ? '—' : '01.04.2025' },
          { label: 'Способ оплаты',      val: user.plan === 'FREE' ? '—' : 'Т-Банк •••• 4242' },
          { label: 'Фото в месяц',       val: String(plan.quota), accent: true },
          { label: 'Период',             val: plan.period },
        ].map(item => (
          <div key={item.label} className="bg-bg-3 rounded-lg px-4 py-3">
            <div className="text-[11px] text-txt-3 uppercase tracking-widest mb-1.5">{item.label}</div>
            <div className={clsx('text-[14px] font-medium', item.accent && 'text-accent font-mono font-bold')}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* What's included */}
      <div className="bg-bg-2 border border-border rounded-xl p-5 mb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-3">Что включено в ваш тариф</div>
        <div className="flex flex-wrap gap-2">
          {PLAN_FEATURES[user.plan].map(f => (
            <span key={f} className="flex items-center gap-1.5 text-[12px] text-txt-2 bg-bg-3 border border-border rounded-lg px-3 py-1.5">
              <span className="text-ok text-[10px]">✓</span>{f}
            </span>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-txt-2 mb-3">История платежей</div>
      <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
        {user.plan === 'FREE' || INVOICES.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3 opacity-30">₽</div>
            <div className="text-[14px] font-semibold text-txt-2 mb-1">Платежей пока нет</div>
            <div className="text-[12px] text-txt-3">Здесь будут чеки и история списаний</div>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Дата','Тариф','Сумма','Чек'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-txt-3 px-5 py-3 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map(inv => (
                <tr key={inv.id} className="hover:bg-bg-3 transition-colors">
                  <td className="px-5 py-3.5 border-b border-border font-mono text-[12px] text-txt-3">{inv.date}</td>
                  <td className="px-5 py-3.5 border-b border-border text-[13px] text-txt-2">{inv.plan}</td>
                  <td className="px-5 py-3.5 border-b border-border font-mono text-[13px] font-semibold">{inv.amount}</td>
                  <td className="px-5 py-3.5 border-b border-border">
                    <button className="text-[12px] text-accent hover:underline" onClick={() => showToast(`Скачивание чека ${inv.id}...`, 'ok')}>
                      ↓ {inv.id}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Legal */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { title:'Оплата Т-Банк', body:'Рекуррентные платежи, автоматическое продление. Отмена в любой момент.' },
          { title:'54-ФЗ соблюдается', body:'Электронный чек отправляется на email при каждом списании.' },
          { title:'152-ФЗ', body:'Данные пользователей хранятся на серверах Selectel в России.' },
        ].map(item => (
          <div key={item.title} className="bg-bg-2 border border-border rounded-lg p-4">
            <div className="text-[13px] font-semibold mb-1.5">{item.title}</div>
            <div className="text-[12px] text-txt-2 leading-relaxed">{item.body}</div>
          </div>
        ))}
      </div>

      {/* Upgrade modal */}
      <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)}
        title="Улучшить тариф"
        subtitle="Выберите план. Оплата через Т-Банк, отмена в любой момент.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          {(['STARTER','PRO','AGENCY'] as const).map(key => {
            const p = PLANS[key]
            return (
              <button key={key} onClick={() => setSelected(key)}
                className={clsx('text-left p-4 rounded-xl border transition-all',
                  selected === key ? 'border-accent bg-accent/8' : 'border-border bg-bg-3 hover:border-border-2')}>
                <div className="text-[13px] font-semibold mb-1">{p.name}</div>
                <div className={clsx('font-mono text-xl font-bold mb-2', selected === key && 'text-accent')}>{p.priceStr}<span className="text-[11px] font-normal text-txt-3">/мес</span></div>
                <div className="text-[11px] text-txt-3">{p.quota.toLocaleString()} фото/мес</div>
              </button>
            )
          })}
        </div>

        <div className="mb-4">
          <label className="label">Email для чека (54-ФЗ)</label>
          <input className="input" type="email" placeholder="your@email.ru" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="bg-accent/8 border border-accent/20 rounded-lg px-4 py-3 mb-5 text-[12px] text-accent">
          В продакшене здесь редирект на страницу оплаты Т-Банк (POST /api/payments/init).
        </div>

        <button className={clsx('btn btn-primary w-full justify-center py-3', paying && 'opacity-60')}
          disabled={paying} onClick={handlePay}>
          {paying ? 'Перенаправляем...' : `Перейти к оплате → ${PLANS[selected].priceStr}/мес`}
        </button>
      </Modal>
    </div>
  )
}
