// src/services/geocoder.ts
// Yandex Geocoder API — free up to 25,000 req/day
// Docs: https://yandex.ru/dev/geocode/doc/ru/

interface GeoResult {
  lat: number
  lon: number
  city: string
  country: string
  fullAddress: string
}

export async function geocodeAddress(address: string): Promise<GeoResult> {
  const apiKey = process.env.YANDEX_GEOCODER_KEY
  if (!apiKey) throw new Error('YANDEX_GEOCODER_KEY не задан')

  const url = new URL('https://geocode-maps.yandex.ru/1.x/')
  url.searchParams.set('apikey', apiKey)
  url.searchParams.set('geocode', address)
  url.searchParams.set('format', 'json')
  url.searchParams.set('lang', 'ru_RU')
  url.searchParams.set('results', '1')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Yandex Geocoder HTTP ${res.status}`)

  const data = await res.json()

  const featureMembers = data?.response?.GeoObjectCollection?.featureMember
  if (!featureMembers?.length) throw new Error('Адрес не найден')

  const geo = featureMembers[0].GeoObject
  const [lonStr, latStr] = geo.Point.pos.split(' ')
  const lat = parseFloat(latStr)
  const lon = parseFloat(lonStr)

  // Extract city name from components
  const components = geo.metaDataProperty?.GeocoderMetaData?.Address?.Components || []
  const cityComp = components.find((c: any) => c.kind === 'locality')
  const countryComp = components.find((c: any) => c.kind === 'country')

  return {
    lat,
    lon,
    city: cityComp?.name || '',
    country: countryComp?.name || 'Россия',
    fullAddress: geo.metaDataProperty?.GeocoderMetaData?.Address?.formatted || address,
  }
}
