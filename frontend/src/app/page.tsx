// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND } from '@/lib/constants'
import { LandingNicheDemo } from '@/components/pages/LandingNicheDemo'
import { LandingFaq } from '@/components/pages/LandingFaq'

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
}

const HOW_STEPS = [
  { n: '01', title: 'Загрузите фотографии', body: 'Drag & drop до 5 000 фото. JPG, JPEG, PNG до 15 МБ. Пакетная загрузка без ограничений на Agency-тарифе.' },
  { n: '02', title: 'Настройте SEO-параметры', body: 'Выберите нишу — ключевые слова загрузятся автоматически. Введите адрес — GPS определятся через Яндекс Геокодер.' },
  { n: '03', title: 'Выберите режим', body: 'Яндекс Карты, Яндекс Картинки, Google Maps или GEO SEO. Каждый режим оптимизирует разные поля метаданных.' },
  { n: '04', title: 'Скачайте ZIP-архив', body: 'Переименованные файлы + прошитые метаданные + HTML-отчёт + CSV. Ссылка действует 24 часа.' },
]

const FEATURES = [
  { icon: '📍', title: 'GPS в EXIF автоматически', body: 'Вводите адрес — Яндекс Геокодер конвертирует в координаты и записывает GPSLatitude / Longitude.' },
  { icon: '🏷', title: 'IPTC + XMP метаданные', body: 'Title, Description, Keywords, Author, Copyright, City, Country — все поля в один клик.' },
  { icon: '📂', title: 'SEO-имя файла', body: 'IMG_3345.jpg → stomatologiya-moskva.jpg. Транслитерация + ниша + город + уникальный slug.' },
  { icon: '⚡', title: 'Шаблоны 9 ниш', body: 'Стоматология, косметология, недвижимость, ресторан и др. Кириллица + латиница.' },
  { icon: '🗺', title: 'GEO SEO генератор', body: 'Автоварианты: «ниша Город», «лучший ниша Город», «ниша рядом Город».' },
  { icon: '📦', title: 'ZIP + HTML-отчёт', body: 'Архив с переименованными фото, HTML-отчётом и CSV-таблицей для Excel.' },
]

const MODES = [
  { key: 'ЯНДЕКС КАРТЫ',    title: 'Яндекс Карты',    desc: 'GPS в EXIF, кириллические ключевые слова, точный адрес в Location. Фокус на локальный поиск.', pro: false },
  { key: 'ЯНДЕКС КАРТИНКИ', title: 'Яндекс Картинки', desc: 'Расширенный ALT-тег, Description 160 символов, до 15 ключевых слов.', pro: false },
  { key: 'GOOGLE MAPS',     title: 'Google Maps',      desc: 'Ключевые слова на английском, Plus Code, латинский транслит.', pro: false },
  { key: 'GEO SEO',         title: 'GEO SEO',          desc: 'Автогенерация вариантов: «Ниша Город», «лучший Ниша Город», «Ниша рядом Город».', pro: true },
]

const PLANS = [
  { key: 'FREE',    name: 'Бесплатный', price: '0 ₽',      period: 'навсегда', popular: false, yes: ['10 фото / месяц','1 шаблон ниши','IPTC-метаданные','GPS в EXIF','SEO-имя файла'],                               no: ['GEO SEO','Пакетная обработка','API'],    cta: 'Начать бесплатно' },
  { key: 'STARTER', name: 'Старт',      price: '890 ₽',    period: 'в месяц',  popular: false, yes: ['100 фото / месяц','Все 9 ниш','ALT-теги','Яндекс + Google','CSV-отчёт'],                                      no: ['GEO SEO','CSV-импорт','API'],            cta: 'Подключить'       },
  { key: 'PRO',     name: 'Про',        price: '2 490 ₽',  period: 'в месяц',  popular: true,  yes: ['1 000 фото / месяц','GEO SEO режим','Все 4 режима','Пакетная обработка','CSV-отчёт'],                         no: ['CSV-импорт','API'],                      cta: 'Подключить'       },
  { key: 'AGENCY',  name: 'Агентство',  price: '6 900 ₽',  period: 'в месяц',  popular: false, yes: ['5 000+ фото / месяц','Все режимы','CSV-импорт','API-доступ','White-label ZIP','Приоритетная поддержка'],      no: [],                                        cta: 'Подключить'       },
]

const BEFORE_ROWS = [['Имя файла','IMG_3345.jpg'],['IPTC Title','—'],['IPTC Keywords','—'],['GPS координаты','—'],['ALT тег','—']]
const AFTER_ROWS  = [['Имя файла','stomatologiya-moskva.jpg'],['IPTC Title','Стоматология Улыбка'],['IPTC Keywords','стоматология, дентист…'],['GPS координаты','55.7558°, 37.6176°'],['ALT тег','Стоматология в Москве']]
const NAV_LINKS   = [['#how','Как работает'],['#features','Возможности'],['#pricing','Тарифы'],['#faq','FAQ']]
const STATS       = [['9','ниш бизнеса'],['4','SEO-режима'],['5 000+','фото/мес Agency'],['54-ФЗ','соблюдается']]
const MARQUEE     = ['IPTC Keywords','GPS в EXIF','Яндекс Карты','Яндекс Картинки','Google Maps','GEO SEO','SEO-имя файла','ALT-теги','ZIP-архив','XMP метаданные','152-ФЗ','Т-Банк оплата']

export default function LandingPage() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-[58px] border-b border-border bg-bg backdrop-blur-xl" style={{backgroundColor:'rgba(10,10,11,0.88)'}}>
        <div className="flex items-center gap-2 font-mono text-[15px] font-bold">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Pix<span className="text-accent">Tager</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="px-4 py-2 text-[13px] text-txt-2 hover:text-txt rounded-lg transition-colors">{label}</a>
          ))}
          <Link href="/auth" className="px-4 py-2 text-[13px] text-txt-2 hover:text-txt rounded-lg transition-colors">Войти</Link>
        </div>
        <Link href="/auth" className="btn btn-primary text-sm px-5 py-2">Начать бесплатно →</Link>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[.18]" style={{backgroundImage:'linear-gradient(#27272b 1px,transparent 1px),linear-gradient(90deg,#27272b 1px,transparent 1px)',backgroundSize:'56px 56px',maskImage:'radial-gradient(ellipse 80% 65% at 50% 45%,black 25%,transparent 100%)'}} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] pointer-events-none" style={{background:'radial-gradient(ellipse,rgba(232,180,74,.10) 0%,transparent 70%)'}} />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold bg-bg-3 border border-border-2 rounded-full px-4 py-1.5 text-accent mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            SEO-инструмент для локального бизнеса
          </div>
          <h1 className="font-display text-[clamp(38px,6.5vw,80px)] font-black leading-[1.05] tracking-[-0.04em] mb-6">
            Прошивайте метаданные<br /><span className="text-accent">в сотни фото за минуты</span>
          </h1>
          <p className="text-[clamp(15px,2vw,19px)] text-txt-2 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Автоматически записывает IPTC-метаданные, GPS-координаты и SEO-данные.<br />
            Ваши фото попадают в топ Яндекс Карт, Яндекс Картинок и Google Maps.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth" className="btn btn-primary btn-xl">Попробовать бесплатно →</Link>
            <a href="#how" className="btn btn-ghost btn-xl">Как это работает</a>
          </div>
          <div className="flex gap-10 justify-center mt-16 pt-10 border-t border-border flex-wrap">
            {STATS.map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-bold">{n}</div>
                <div className="text-xs text-txt-3 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-bg-2 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0,1].map((rep) => (
            <div key={rep} className="flex">
              {MARQUEE.map((item) => (
                <span key={item} className="flex items-center gap-3 px-7 font-mono text-[12px] text-txt-3">
                  <strong className="text-accent">{item}</strong>
                  <span className="text-border-2">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="how" className="px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Как работает</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-14">4 шага до SEO-оптимизированных фото</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden">
          {HOW_STEPS.map((s) => (
            <div key={s.n} className="bg-bg-2 p-8 hover:bg-bg-3 transition-colors">
              <div className="font-mono text-[11px] font-bold text-accent border border-accent/30 rounded px-2 py-0.5 inline-block mb-5" style={{background:'rgba(232,180,74,0.08)'}}>{s.n}</div>
              <div className="text-[15px] font-semibold mb-3 leading-snug">{s.title}</div>
              <div className="text-[13px] text-txt-2 leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-10 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4 inline-block">До и после</div>
            <h2 className="font-display text-[clamp(22px,3.5vw,36px)] font-bold tracking-tight">Что меняется в файле</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-center">
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="font-mono text-[10px] font-bold text-txt-3 uppercase tracking-widest mb-4">ДО обработки</div>
              {BEFORE_ROWS.map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-border last:border-0 text-[12px]">
                  <span className="font-mono text-txt-3">{k}</span><span className="text-txt-3">{v}</span>
                </div>
              ))}
            </div>
            <div className="hidden md:flex w-10 h-10 rounded-full border border-accent/25 items-center justify-center text-accent text-lg flex-shrink-0" style={{background:'rgba(232,180,74,0.1)'}}>→</div>
            <div className="bg-bg-2 border border-accent/25 rounded-xl p-5" style={{background:'rgba(232,180,74,0.02)'}}>
              <div className="font-mono text-[10px] font-bold text-accent uppercase tracking-widest mb-4">ПОСЛЕ обработки</div>
              {AFTER_ROWS.map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-border last:border-0 text-[12px]">
                  <span className="font-mono text-txt-3">{k}</span><span className="font-mono text-accent font-semibold truncate max-w-[200px]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-bg-2 border-y border-border px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Возможности</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-4">Всё для локального SEO</h2>
        <p className="text-txt-2 text-base mb-14 max-w-lg">Один инструмент заменяет Photoshop, ExifTool и часы ручной работы.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-bg border border-border rounded-xl p-6 hover:border-border-2 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 border border-accent/15" style={{background:'rgba(232,180,74,0.08)'}}>{f.icon}</div>
              <div className="text-[15px] font-semibold mb-2">{f.title}</div>
              <div className="text-[13px] text-txt-2 leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">SEO-режимы</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-14">Разная оптимизация под каждую платформу</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODES.map((m) => (
            <div key={m.key} className={`border rounded-xl p-6 transition-colors ${m.pro ? 'border-accent/30' : 'border-border bg-bg-2 hover:border-border-2'}`} style={m.pro ? {background:'rgba(232,180,74,0.025)'} : {}}>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/25 rounded px-2 py-0.5 inline-block mb-3" style={{background:'rgba(232,180,74,0.08)'}}>
                {m.key}{m.pro ? ' ✦ PRO' : ''}
              </div>
              <div className="font-display text-lg font-bold tracking-tight mb-2">{m.title}</div>
              <div className="text-[13px] text-txt-2 leading-relaxed">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-10 pb-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Шаблоны ниш</div>
        <h2 className="font-display text-[clamp(22px,3.5vw,36px)] font-bold tracking-tight mb-10">Ключевые слова загружаются автоматически</h2>
        <LandingNicheDemo />
      </section>

      <section id="pricing" className="bg-bg-2 border-y border-border px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Тарифы</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-3">Простые цены для любого масштаба</h2>
        <p className="text-txt-2 text-base mb-14">Оплата через Т-Банк. Рекуррентные платежи, отмена в любой момент.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANS.map((plan) => (
            <div key={plan.key} className={`relative flex flex-col rounded-xl p-5 border transition-colors ${plan.popular ? 'border-accent/40' : 'border-border bg-bg hover:border-border-2'}`} style={plan.popular ? {background:'rgba(232,180,74,0.025)'} : {}}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold bg-accent text-black px-3 py-1 rounded-full whitespace-nowrap">ПОПУЛЯРНЫЙ</div>
              )}
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-txt-3 mb-3">{plan.name}</div>
              <div className="font-display text-3xl font-bold tracking-tight mb-1">{plan.price}</div>
              <div className="text-xs text-txt-3 mb-5">{plan.period}</div>
              <ul className="flex-1 space-y-0 mb-5">
                {plan.yes.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs py-[5px] border-b border-border last:border-0 text-txt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ok flex-shrink-0" />{f}
                  </li>
                ))}
                {plan.no.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs py-[5px] border-b border-border last:border-0 text-txt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-2 flex-shrink-0" />— {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className={`w-full py-2.5 text-center text-[13px] font-semibold rounded-lg border transition-all block ${plan.popular ? 'bg-accent border-accent text-black hover:bg-accent-2' : 'bg-bg-3 border-border-2 text-txt hover:border-txt-2'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="px-10 py-24">
        <div className="text-center mb-12">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4 inline-block">FAQ</div>
          <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight">Частые вопросы</h2>
        </div>
        <LandingFaq />
      </section>

      <div className="mx-10 mb-20 rounded-2xl border border-accent/20 p-16 text-center relative overflow-hidden" style={{background:'linear-gradient(135deg,rgba(232,180,74,0.06) 0%,transparent 60%)'}}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(232,180,74,0.07) 0%,transparent 70%)'}} />
        <h2 className="font-display text-[clamp(22px,4vw,40px)] font-bold tracking-tight mb-3 relative z-10">Начните оптимизировать фото прямо сейчас</h2>
        <p className="text-txt-2 text-base mb-8 max-w-md mx-auto relative z-10">10 фото бесплатно. Без карты. Без ограничений по времени.</p>
        <Link href="/auth" className="btn btn-primary btn-xl relative z-10 inline-flex">Создать аккаунт бесплатно →</Link>
      </div>

      <footer className="flex items-center justify-between px-10 py-8 border-t border-border bg-bg-2 text-[12px] text-txt-3 flex-wrap gap-4">
        <div className="flex items-center gap-2 font-mono font-bold text-[13px] text-txt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />Pix<span className="text-accent">Tager</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-txt-2 transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-txt-2 transition-colors">Оферта</a>
          <a href="#" className="hover:text-txt-2 transition-colors">Поддержка</a>
        </div>
        <div>© 2025 PixTager · Данные хранятся в РФ</div>
      </footer>
    </>
  )
}
