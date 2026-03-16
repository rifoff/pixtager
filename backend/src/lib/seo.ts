// src/lib/seo.ts
import { transliterate } from 'transliteration'

const NICHE_NAMES: Record<string, string> = {
  stom: 'stomatologiya',
  cosmo: 'kosmetologiya',
  realty: 'nedvizhimost',
  rest: 'restoran',
  hotel: 'gostinitza',
  fitness: 'fitnes',
  med: 'klinika',
  law: 'yurist',
  build: 'stroitelstvo',
}

export function generateSlug(
  business: string,
  city: string,
  niche: string | null | undefined,
  index: number
): string {
  const nichePart = niche && NICHE_NAMES[niche] ? NICHE_NAMES[niche] : toSlug(business).slice(0, 20)
  const cityPart = toSlug(city).slice(0, 15)
  const parts = [nichePart]
  if (cityPart) parts.push(cityPart)
  if (index > 0) parts.push(String(index + 1))
  return parts.join('-')
}

export function generateAlt(
  business: string,
  city: string,
  mode: string,
  niche: string | null | undefined
): string {
  const nicheLabel = NICHE_DISPLAY[niche || ''] || business
  switch (mode) {
    case 'YANDEX_MAPS':
      return `${nicheLabel} в ${city} — ${business}`
    case 'YANDEX_IMAGES':
      return `Фото ${nicheLabel} в ${city}. ${business}`
    case 'GOOGLE_MAPS':
      return `${business} — ${nicheLabel} in ${city}, Russia`
    case 'GEO_SEO':
      return `${nicheLabel} ${city} — ${business}`
    default:
      return `${business} — ${nicheLabel}, ${city}`
  }
}

export function generateGeoKeywords(base: string, city: string): string[] {
  if (!base || !city) return []
  return [
    `${base} ${city}`,
    `${base} в ${city}`,
    `лучший ${base} ${city}`,
    `${base} рядом с ${city}`,
    `${base} ${city} цены`,
    `${base} ${city} отзывы`,
    `${base} ${city} адрес`,
    `заказать ${base} ${city}`,
  ]
}

export function toSlug(str: string): string {
  return transliterate(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const NICHE_DISPLAY: Record<string, string> = {
  stom: 'Стоматологическая клиника',
  cosmo: 'Косметологическая клиника',
  realty: 'Агентство недвижимости',
  rest: 'Ресторан',
  hotel: 'Гостиница',
  fitness: 'Фитнес-клуб',
  med: 'Медицинская клиника',
  law: 'Юридическая фирма',
  build: 'Строительная компания',
}
