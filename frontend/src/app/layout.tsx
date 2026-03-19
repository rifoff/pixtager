// src/app/layout.tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s – ПиксТэгер', default: 'ПиксТэгер – Массовая SEO-прошивка фотографий' },
  description: 'Прошивайте IPTC-метаданные, GPS и SEO-данные в фотографии для Яндекс Карт, Яндекс Картинок и Google Maps.',
  keywords: ['SEO фото', 'IPTC метаданные', 'Яндекс Карты', 'Google Maps', 'GPS EXIF'],
  icons: {
    icon: [
      { url: '/favicon_100.png', sizes: '100x100', type: 'image/png' },
      { url: '/favicon_150.png', sizes: '150x150', type: 'image/png' },
    ],
    shortcut: '/favicon_100.png',
    apple: '/favicon_150.png',
  },
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