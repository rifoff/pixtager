// src/lib/constants.ts

export const BRAND = {
  name: 'PixTager',
  tagline: 'Массовая SEO-прошивка фотографий',
  description: 'Прошивайте IPTC-метаданные, GPS и SEO-данные в фотографии для Яндекс Карт, Яндекс Картинок и Google Maps.',
  domain: 'pixtager.ru',
  supportEmail: 'help@pixtager.ru',
}

export const PLANS = {
  FREE:    { name: 'Бесплатный', price: 0,    priceStr: '0 ₽',       quota: 10,   period: 'навсегда' },
  STARTER: { name: 'Старт',      price: 890,  priceStr: '890 ₽',     quota: 100,  period: 'в месяц'  },
  PRO:     { name: 'Про',        price: 2490, priceStr: '2 490 ₽',   quota: 1000, period: 'в месяц'  },
  AGENCY:  { name: 'Агентство',  price: 6900, priceStr: '6 900 ₽',   quota: 5000, period: 'в месяц'  },
} as const

export type PlanKey = keyof typeof PLANS

export const SEO_MODES = {
  YANDEX_MAPS:   { label: 'Яндекс Карты',    short: 'Я.Карты'   },
  YANDEX_IMAGES: { label: 'Яндекс Картинки', short: 'Я.Картинки'},
  GOOGLE_MAPS:   { label: 'Google Maps',      short: 'G.Maps'    },
  GEO_SEO:       { label: 'GEO SEO',          short: 'GEO SEO', pro: true },
} as const

export type SeoModeKey = keyof typeof SEO_MODES
