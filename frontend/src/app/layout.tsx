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
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108182254', 'ym');
          ym(108182254, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}} />
        <noscript><div><img src="https://mc.yandex.ru/watch/108182254" style={{position:'absolute', left:'-9999px'}} alt="" /></div></noscript>
        {children}
      </body>
    </html>
  )
}