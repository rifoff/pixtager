// src/app/page.tsx  — Landing page
import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND, PLANS, SEO_MODES } from '@/lib/constants'
import { LandingNicheDemo } from '@/components/pages/LandingNicheDemo'
import { LandingFaq } from '@/components/pages/LandingFaq'

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
}

export default function LandingPage() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-[58px] border-b border-border bg-bg/85 backdrop-blur-xl">
        <div className="flex items-center gap-2 font-mono text-[15px] font-bold">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Pix<span className="text-accent">Tager</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {[['#how','Как работает'],['#features','Возможности'],['#pricing','Тарифы'],['#faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href} className="px-4 py-2 text-[13px] text-txt-2 hover:text-txt rounded-lg transition-colors">{label}</a>
          ))}
          <Link href="/auth" className="px-4 py-2 text-[13px] text-txt-2 hover:text-txt rounded-lg transition-colors">Войти</Link>
        </div>
        <Link href="/auth" className="btn btn-primary text-sm px-5 py-2">Начать бесплатно →</Link>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* grid bg */}
        <div className="absolute inset-0 opacity-[.18]"
          style={{ backgroundImage:'linear-gradient(#27272b 1px,transparent 1px),linear-gradient(90deg,#27272b 1px,transparent 1px)', backgroundSize:'56px 56px',
            maskImage:'radial-gradient(ellipse 80% 65% at 50% 45%,black 25%,transparent 100%)' }} />
        {/* glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse,rgba(232,180,74,.10) 0%,transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold bg-bg-3 border border-border-2 rounded-full px-4 py-1.5 text-accent mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            SEO-инструмент для локального бизнеса
          </div>
          <h1 className="font-display text-[clamp(38px,6.5vw,80px)] font-black leading-[1.05] tracking-[-0.04em] mb-6">
            Прошивайте метаданные<br />
            <span className="text-accent">в сотни фото за минуты</span>
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
            {[['9','ниш бизнеса'],['4','SEO-режима'],['5 000+','фото/мес Agency'],['54-ФЗ','соблюдается']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-bold">{n}</div>
                <div className="text-xs text-txt-3 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-bg-2 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex">
              {['IPTC Keywords','GPS в EXIF','Яндекс Карты','Яндекс Картинки','Google Maps','GEO SEO','SEO-имя файла','ALT-теги','ZIP-архив','XMP метаданные','152-ФЗ','Т-Банк оплата'].map(item => (
                <span key={item} className="flex items-center gap-3 px-7 font-mono text-[12px] text-txt-3">
                  <strong className="text-accent/80">{item}</strong>
                  <span className="text-border-2">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Как работает</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-14">4 шага до SEO-оптимизированных фото</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden">
          {[
            ['01','Загрузите фотографии','Drag & drop до 5 000 фото. JPG, JPEG, PNG до 15 МБ каждый. Пакетная загрузка без ограничений на Agency-тарифе.'],
            ['02','Настройте SEO-параметры','Выберите нишу — ключевые слова загрузятся автоматически. Введите адрес — координаты GPS определятся через Яндекс Геокодер.'],
            ['03','Выберите режим','Яндекс Карты, Яндекс Картинки, Google Maps или GEO SEO. Каждый режим оптимизирует разные поля метаданных.'],
            ['04','Скачайте ZIP-архив','Переименованные файлы + прошитые метаданные + HTML-отчёт + CSV. Ссылка действует 24 часа.'],
          ].map(([n, title, body]) => (
            <div key={n} className="bg-bg-2 p-8 hover:bg-bg-3 transition-colors">
              <div className="font-mono text-[11px] font-bold text-accent border border-accent/30 bg-accent/8 rounded px-2 py-0.5 inline-block mb-5">{n}</div>
              <div className="text-[15px] font-semibold mb-3 leading-snug">{title}</div>
              <div className="text-[13px] text-txt-2 leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="px-10 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4 inline-block">До и после</div>
            <h2 className="font-display text-[clamp(22px,3.5vw,36px)] font-bold tracking-tight">Что меняется в файле</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-center">
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="font-mono text-[10px] font-bold text-txt-3 uppercase tracking-widest mb-4">ДО обработки</div>
              {[['Имя файла','IMG_3345.jpg'],['IPTC Title','—'],['IPTC Keywords','—'],['GPS координаты','—'],['ALT тег','—']].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-border last:border-0 text-[12px]">
                  <span className="font-mono text-txt-3">{k}</span>
                  <span className="text-txt-3">{v}</span>
                </div>
              ))}
            </div>
            <div className="hidden md:flex w-10 h-10 rounded-full bg-accent/10 border border-accent/25 items-center justify-center text-accent text-lg flex-shrink-0">→</div>
            <div className="bg-bg-2 border border-accent/25 rounded-xl p-5" style={{background:'rgba(232,180,74,0.02)'}}>
              <div className="font-mono text-[10px] font-bold text-accent uppercase tracking-widest mb-4">ПОСЛЕ обработки</div>
              {[['Имя файла','stomatologiya-moskva.jpg'],['IPTC Title','Стоматология Улыбка'],['IPTC Keywords','стоматология, дентист…'],['GPS координаты','55.7558° с.ш., 37.6176° в.д.'],['ALT тег','Стоматология в Москве']].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-border last:border-0 text-[12px]">
                  <span className="font-mono text-txt-3">{k}</span>
                  <span className="font-mono text-accent font-semibold truncate max-w-[200px]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-bg-2 border-y border-border px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Возможности</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-4">Всё для локального SEO</h2>
        <p className="text-txt-2 text-base mb-14 max-w-lg">Один инструмент заменяет Photoshop, ExifTool и часы ручной работы.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['📍','GPS в EXIF автоматически','Вводите адрес — Яндекс Геокодер конвертирует в координаты и записывает GPSLatitude/Longitude.'],
            ['🏷','IPTC + XMP метаданные','Title, Description, Keywords, Author, Copyright, City, Country, Location — все поля в один клик.'],
            ['📂','SEO-имя файла','IMG_3345.jpg → stomatologiya-moskva.jpg. Транслитерация + ниша + город + уникальный slug.'],
            ['⚡','Шаблоны 9 ниш','Стоматология, косметология, недвижимость, ресторан и др. Кириллица + латиница.'],
            ['🗺','GEO SEO генератор','Автоварианты: «ниша Город», «лучший ниша Город», «ниша рядом Город». 8+ вариантов.'],
            ['📦','ZIP + HTML-отчёт','Архив с переименованными фото, HTML-отчётом и CSV-таблицей для Excel.'],
          ].map(([icon, title, body]) => (
            <div key={title} className="bg-bg border border-border rounded-xl p-6 hover:border-border-2 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center text-xl mb-4">{icon}</div>
              <div className="text-[15px] font-semibold mb-2">{title}</div>
              <div className="text-[13px] text-txt-2 leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO MODES */}
      <section className="px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">SEO-режимы</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-14">Разная оптимизация под каждую платформу</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(SEO_MODES).map(([key, m]) => (
            <div key={key} className={`border rounded-xl p-6 transition-colors ${m.pro ? 'border-accent/30 bg-accent/[0.025]' : 'border-border bg-bg-2 hover:border-border-2'}`}>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/25 bg-accent/8 rounded px-2 py-0.5 inline-block mb-3">
                {key}{m.pro ? ' ✦ PRO' : ''}
              </div>
              <div className="font-display text-lg font-bold tracking-tight mb-2">{m.label}</div>
              <div className="text-[13px] text-txt-2 leading-relaxed">
                {key === 'YANDEX_MAPS'   && 'IPTC с GPS-координатами, кириллические ключевые слова, точный адрес в Location. Фокус на локальный поиск.'}
                {key === 'YANDEX_IMAGES' && 'Расширенный ALT-тег, Description 160 символов, до 15 ключевых слов. Яндекс индексирует IPTC Description напрямую.'}
                {key === 'GOOGLE_MAPS'   && 'Ключевые слова на английском, Plus Code, латинский транслит. Google Maps сканирует английские IPTC поля.'}
                {key === 'GEO_SEO'       && 'Автогенерация десятков вариантов ключевых слов с городом. «Ниша Город», «лучший Ниша Город», «Ниша рядом Город».'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NICHES DEMO */}
      <section className="px-10 pb-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Шаблоны ниш</div>
        <h2 className="font-display text-[clamp(22px,3.5vw,36px)] font-bold tracking-tight mb-10">Ключевые слова загружаются автоматически</h2>
        <LandingNicheDemo />
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-bg-2 border-y border-border px-10 py-24">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4">Тарифы</div>
        <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight mb-3">Простые цены для любого масштаба</h2>
        <p className="text-txt-2 text-base mb-14">Оплата через Т-Банк. Рекуррентные платежи, отмена в любой момент.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
            const isPop = key === 'PRO'
            const features: Record<string, string[]> = {
              FREE:    ['10 фото / месяц','1 шаблон ниши','IPTC-метаданные','GPS в EXIF','SEO-имя файла'],
              STARTER: ['100 фото / месяц','Все 9 ниш','ALT-теги','Яндекс + Google','CSV-отчёт'],
              PRO:     ['1 000 фото / месяц','GEO SEO режим','Все 4 режима','Пакетная обработка','CSV-отчёт'],
              AGENCY:  ['5 000+ фото / месяц','Все режимы','CSV-импорт','API-доступ','White-label ZIP'],
            }
            const disabled: Record<string, string[]> = {
              FREE:    ['GEO SEO','Пакетная обработка','API'],
              STARTER: ['GEO SEO','CSV-импорт','API'],
              PRO:     ['CSV-импорт','API'],
              AGENCY:  [],
            }
            return (
              <div key={key} className={`relative flex flex-col rounded-xl p-5 border transition-colors ${isPop ? 'border-accent/40 bg-accent/[0.025]' : 'border-border bg-bg hover:border-border-2'}`}>
                {isPop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold bg-accent text-black px-3 py-1 rounded-full whitespace-nowrap">ПОПУЛЯРНЫЙ</div>}
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-txt-3 mb-3">{plan.name}</div>
                <div className="font-display text-3xl font-bold tracking-tight mb-1">{plan.priceStr}</div>
                <div className="text-xs text-txt-3 mb-5">{plan.period}</div>
                <ul className="flex-1 space-y-0 mb-5">
                  {features[key].map(f => <li key={f} className="flex items-center gap-2 text-xs py-[5px] border-b border-border last:border-0 text-txt-2"><span className="w-1.5 h-1.5 rounded-full bg-ok flex-shrink-0" />{f}</li>)}
                  {disabled[key].map(f => <li key={f} className="flex items-center gap-2 text-xs py-[5px] border-b border-border last:border-0 text-txt-3"><span className="w-1.5 h-1.5 rounded-full bg-border-2 flex-shrink-0" />— {f}</li>)}
                </ul>
                <Link href="/auth" className={`w-full py-2.5 text-center text-[13px] font-semibold rounded-lg border transition-all block ${isPop ? 'bg-accent border-accent text-black hover:bg-accent-2' : 'bg-bg-3 border-border-2 text-txt hover:border-txt-2'}`}>
                  {key === 'FREE' ? 'Начать бесплатно' : 'Подключить'}
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-10 py-24">
        <div className="text-center mb-12">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-accent mb-4 inline-block">FAQ</div>
          <h2 className="font-display text-[clamp(24px,4vw,42px)] font-bold tracking-tight">Частые вопросы</h2>
        </div>
        <LandingFaq />
      </section>

      {/* CTA BANNER */}
      <div className="mx-10 mb-20 rounded-2xl border border-accent/20 p-16 text-center relative overflow-hidden"
        style={{background:'linear-gradient(135deg,rgba(232,180,74,0.06) 0%,transparent 60%)'}}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{background:'radial-gradient(circle,rgba(232,180,74,0.07) 0%,transparent 70%)'}} />
        <h2 className="font-display text-[clamp(22px,4vw,40px)] font-bold tracking-tight mb-3 relative z-10">
          Начните оптимизировать фото прямо сейчас
        </h2>
        <p className="text-txt-2 text-base mb-8 max-w-md mx-auto relative z-10">10 фото бесплатно. Без карты. Без ограничений по времени.</p>
        <Link href="/auth" className="btn btn-primary btn-xl relative z-10 inline-flex">Создать аккаунт бесплатно →</Link>
      </div>

      {/* FOOTER */}
      <footer className="flex items-center justify-between px-10 py-8 border-t border-border bg-bg-2 text-[12px] text-txt-3 flex-wrap gap-4">
        <div className="flex items-center gap-2 font-mono font-bold text-[13px] text-txt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />Pix<span className="text-accent">Tager</span>
        </div>
        <div className="flex gap-5">
          {['Политика конфиденциальности','Оферта','Поддержка'].map(l => (
            <a key={l} href="#" className="hover:text-txt-2 transition-colors">{l}</a>
          ))}
        </div>
        <div>© 2025 PixTager · Данные хранятся в РФ</div>
      </footer>
    </>
  )
}
