// src/lib/niches.ts
export interface Niche { id: string; name: string; ru: string[]; en: string[] }

export const NICHES: Niche[] = [
  { id:'stom',    name:'Стоматология',
    ru:['стоматология','стоматолог','лечение зубов','зубной врач','имплантация зубов','отбеливание зубов','детская стоматология','протезирование зубов'],
    en:['dentist','dental clinic','cosmetic dentist','teeth whitening','dental implants','best dentist','orthodontist'] },
  { id:'cosmo',   name:'Косметология',
    ru:['косметология','косметолог','чистка лица','ботокс','мезотерапия','пилинг','лазерная эпиляция','уход за кожей'],
    en:['cosmetology clinic','cosmetologist','skin care','botox','laser hair removal','facial treatment','aesthetic medicine'] },
  { id:'realty',  name:'Недвижимость',
    ru:['продажа квартир','купить квартиру','новостройки','вторичное жильё','риелтор','агентство недвижимости','аренда квартиры','ипотека'],
    en:['real estate','apartments for sale','buy apartment','realtor','property agency','rent apartment','new buildings'] },
  { id:'rest',    name:'Ресторан / кафе',
    ru:['ресторан','кафе','доставка еды','бизнес-ланч','банкет','итальянская кухня','суши','пицца','бар'],
    en:['restaurant','cafe','food delivery','business lunch','italian food','sushi','best restaurant','bar'] },
  { id:'hotel',   name:'Гостиница / отель',
    ru:['гостиница','отель','номер посуточно','забронировать номер','апартаменты','мини-отель','хостел'],
    en:['hotel','book room','accommodation','apartment hotel','hostel','bed and breakfast'] },
  { id:'fitness', name:'Фитнес-клуб',
    ru:['фитнес','спортзал','тренажёрный зал','персональный тренер','йога','групповые тренировки','бассейн','кроссфит'],
    en:['fitness club','gym','personal trainer','yoga','workout','crossfit','swimming pool','sports center'] },
  { id:'med',     name:'Медицинская клиника',
    ru:['медицинская клиника','врач','приём врача','частная клиника','диагностика','МРТ','УЗИ','анализы'],
    en:['medical clinic','doctor','private clinic','health center','diagnostic','MRI','ultrasound'] },
  { id:'law',     name:'Юридическая фирма',
    ru:['юридическая фирма','юрист','адвокат','юридическая консультация','правовая помощь','арбитраж'],
    en:['law firm','lawyer','attorney','legal advice','legal services','arbitration'] },
  { id:'build',   name:'Строительство',
    ru:['строительная компания','ремонт квартир','строительство домов','отделочные работы','строительство под ключ','дизайн интерьера'],
    en:['construction company','renovation','home building','interior design','contractor','turnkey construction'] },
]

export const getNiche = (id: string) => NICHES.find(n => n.id === id)

export function generateGeoKeywords(base: string, city: string): string[] {
  if (!base || !city) return []
  return [
    `${base} ${city}`, `${base} в ${city}`, `лучший ${base} в ${city}`,
    `${base} рядом ${city}`, `${base} ${city} цены`,
    `${base} ${city} отзывы`, `${base} ${city} адрес`, `заказать ${base} ${city}`,
  ]
}

export function generateAlt(business: string, city: string, mode: string, nicheId: string): string {
  const label = getNiche(nicheId)?.ru[0] ?? business
  switch (mode) {
    case 'YANDEX_MAPS':    return `${label} в ${city} — ${business}`
    case 'YANDEX_IMAGES':  return `Фото ${label} в ${city}. ${business}`
    case 'GOOGLE_MAPS':    return `${business} — ${label} in ${city}, Russia`
    case 'GEO_SEO':        return `${label} ${city} — ${business}`
    default:               return `${business} — ${label}, ${city}`
  }
}
