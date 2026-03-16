// src/components/pages/LandingFaq.tsx
'use client'
import { useState } from 'react'

const FAQS = [
  { q: 'Что такое IPTC-метаданные и зачем они нужны?', a: 'IPTC — стандарт метаданных для изображений, который поддерживают все поисковые системы. Яндекс и Google читают IPTC-поля при индексации фотографий: Keywords, Title, Description, GPS-координаты. Правильно заполненные метаданные значительно улучшают видимость фото в локальном поиске.' },
  { q: 'Как GPS-координаты помогают в Яндекс Картах?', a: 'Яндекс Карты сканируют EXIF GPS-данные при загрузке фото бизнеса. Фотографии с точными координатами получают приоритет в локальной выдаче. PixTager автоматически определяет координаты по адресу через Яндекс Геокодер API с точностью до уровня улицы.' },
  { q: 'Изменяет ли сервис само изображение (качество, размер)?', a: 'Нет. PixTager только записывает метаданные в специальные поля файла (IPTC, EXIF, XMP). Само изображение — пиксели, цвета, качество, размер — остаётся полностью неизменным. Файл становится больше лишь на несколько килобайт.' },
  { q: 'Что такое GEO SEO режим?', a: 'GEO SEO автоматически генерирует варианты ключевых слов, комбинируя нишу с городом: «стоматология Москва», «лучший стоматолог Москва», «стоматология рядом с Москвой», «стоматология Москва отзывы». Это расширяет охват под локальные запросы без ручной работы.' },
  { q: 'Как организована оплата? Могу ли я отменить?', a: 'Оплата через Т-Банк Эквайринг. Рекуррентные платежи — списание раз в месяц. Отмена доступна в личном кабинете в любой момент. Электронный чек отправляется на email автоматически согласно 54-ФЗ.' },
  { q: 'Где хранятся мои фотографии?', a: 'Файлы временно хранятся на серверах Selectel в России (152-ФЗ). Ссылка на скачивание действует 24 часа, после чего файлы автоматически удаляются. Мы не храним ваши фотографии постоянно.' },
]

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      {FAQS.map((faq, i) => (
        <div key={i} className="border-b border-border">
          <button
            className="flex items-center justify-between w-full py-5 text-left text-[15px] font-medium hover:text-accent transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {faq.q}
            <span className={`w-6 h-6 rounded-full border border-border-2 flex items-center justify-center text-txt-3 flex-shrink-0 ml-4 transition-all duration-200 ${open === i ? 'rotate-45 border-accent text-accent' : ''}`}>+</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48 pb-5' : 'max-h-0'}`}>
            <p className="text-[14px] text-txt-2 leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
