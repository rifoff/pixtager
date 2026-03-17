// src/app/layout.tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s — PixTager', default: 'PixTager — Массовая SEO-прошивка фотографий' },
  description: 'Прошивайте IPTC-метаданные, GPS и SEO-данные в фотографии для Яндекс Карт, Яндекс Картинок и Google Maps.',
  keywords: ['SEO фото', 'IPTC метаданные', 'Яндекс Карты', 'Google Maps', 'GPS EXIF'],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-bg font-sans text-txt antialiased">
        {children}
      </body>
    </html>
  )
}
