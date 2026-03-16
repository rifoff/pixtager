# PixTager — Массовая SEO-прошивка фотографий

> Автоматически прошивает IPTC-метаданные, GPS-координаты и SEO-данные в фотографии для **Яндекс Карт**, **Яндекс Картинок** и **Google Maps**.

---

## Состав проекта

```
pixtager/
├── frontend/                  # Next.js 14 — 5 страниц
│   └── src/
│       ├── app/
│       │   ├── page.tsx        ← Лендинг (/)
│       │   ├── auth/           ← Вход / Регистрация (/auth)
│       │   ├── app/            ← Приложение (/app)
│       │   └── dashboard/      ← Личный кабинет (/dashboard)
│       │       ├── page.tsx         Обзор
│       │       ├── jobs/            История заданий
│       │       ├── billing/         Тариф и оплата
│       │       └── profile/         Профиль
│       ├── components/
│       │   ├── ui/             ← Logo, Toast, Modal, ProgressBar, StatusBadge
│       │   └── pages/          ← Все страничные компоненты
│       └── lib/
│           ├── constants.ts    ← BRAND, PLANS, SEO_MODES
│           ├── niches.ts       ← 9 ниш + generateGeoKeywords + generateAlt
│           └── store.ts        ← Zustand + persist
│
├── backend/                   # Fastify API + BullMQ Worker
│   └── src/
│       ├── routes/
│       │   ├── auth.ts         ← POST /api/auth/register|login, GET /api/auth/me
│       │   ├── upload.ts       ← POST /api/upload/start
│       │   ├── jobs.ts         ← GET /api/jobs, /api/jobs/:id, /api/jobs/:id/download
│       │   └── payments.ts     ← POST /api/payments/init|webhook|charge-recurring
│       ├── workers/
│       │   └── imageWorker.ts  ← ExifTool + sharp + archiver (BullMQ worker)
│       ├── services/
│       │   └── geocoder.ts     ← Яндекс Геокодер API
│       └── lib/
│           ├── prisma.ts       ← Prisma singleton
│           ├── queue.ts        ← BullMQ + Redis
│           └── seo.ts          ← generateSlug, generateAlt, generateGeoKeywords
│
├── docker-compose.yml         ← PostgreSQL + Redis + backend + worker + frontend
├── .env.example               ← Все переменные окружения
└── README.md
```

---

## Страницы

| URL | Страница | Описание |
|-----|----------|----------|
| `/` | Лендинг | Маркетинговая страница с демо ниш, FAQ, тарифами |
| `/auth` | Авторизация | Вход и регистрация с индикатором силы пароля |
| `/app` | Приложение | Мастер: Загрузка → Настройки → Обработка → Скачать |
| `/dashboard` | Обзор | Статистика, квота, последние задания |
| `/dashboard/jobs` | Задания | История с фильтрами, скачивание ZIP |
| `/dashboard/billing` | Тариф | Текущий план, счета, апгрейд через Т-Банк |
| `/dashboard/profile` | Профиль | Email, пароль, настройки по умолчанию |

---

## Быстрый старт (Docker)

```bash
# 1. Клонировать
git clone https://github.com/yourname/pixtager && cd pixtager

# 2. Настроить окружение
cp .env.example .env
# Обязательно заполнить:
# YANDEX_GEOCODER_KEY — https://developer.tech.yandex.ru/
# TINKOFF_TERMINAL_KEY + TINKOFF_PASSWORD — https://www.tbank.ru/kassa/
# JWT_SECRET — любая длинная случайная строка
# PASSWORD_SALT — любая случайная строка

# 3. Запуск
docker-compose up -d

# 4. Применить миграции БД
docker-compose exec backend npx prisma migrate deploy

# Открыть: http://localhost:3000
```

---

## Локальная разработка

**Требования:** Node.js 20+, PostgreSQL 16, Redis 7, ExifTool

```bash
# ExifTool установка:
# macOS:   brew install exiftool
# Ubuntu:  apt install libimage-exiftool-perl

# Terminal 1 — Frontend
cd frontend && npm install && npm run dev
# → http://localhost:3000

# Terminal 2 — Backend API
cd backend && npm install && npx prisma migrate dev && npm run dev
# → http://localhost:4000

# Terminal 3 — Image Worker
cd backend && npm run worker
```

---

## API

### Авторизация
```
POST /api/auth/register   { email, password }
POST /api/auth/login      { email, password }  → { token, userId, plan }
GET  /api/auth/me         Bearer <token>
```

### Обработка фото
```
POST /api/upload/start    multipart/form-data: files[] + settings JSON
  → { jobId, fileCount }

GET  /api/jobs/:id        → { status, totalFiles, processed, progress, zipUrl }
GET  /api/jobs/:id/download  → ZIP stream
GET  /api/jobs            → Job[]
```

### Оплата (Т-Банк)
```
POST /api/payments/init          { plan, userId, email } → { paymentUrl }
POST /api/payments/webhook       Tinkoff notification (SHA-256 подпись)
POST /api/payments/charge-recurring  Internal cron endpoint
```

---

## Тарифы

| Тариф | Цена | Фото/мес | Ключевые возможности |
|-------|------|----------|---------------------|
| **Бесплатный** | 0 ₽ | 10 | IPTC + GPS + SEO-имя файла |
| **Старт** | 890 ₽/мес | 100 | Все 9 ниш, ALT-теги, Яндекс + Google |
| **Про** | 2 490 ₽/мес | 1 000 | GEO SEO, все 4 режима |
| **Агентство** | 6 900 ₽/мес | 5 000+ | API, CSV-импорт, White-label ZIP |

---

## SEO-режимы

| Режим | Для чего |
|-------|----------|
| **Яндекс Карты** | GPS в EXIF, кириллические ключевые слова, точный адрес |
| **Яндекс Картинки** | Расширенный ALT, Description 160 символов, 15+ ключевых слов |
| **Google Maps** | Английские ключевые слова, латиница, Plus Code |
| **GEO SEO** | Автогенерация вариантов: «ниша Город», «лучший ниша Город» |

---

## Технологии

| Слой | Стек |
|------|------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Zustand, TypeScript |
| Backend | Fastify 4, TypeScript, Prisma ORM, Zod |
| База данных | PostgreSQL 16 |
| Очередь | BullMQ + Redis 7 |
| Метаданные | ExifTool (exiftool-vendored) — IPTC + EXIF + XMP |
| Геокодирование | Яндекс Геокодер API (25 000 req/day бесплатно) |
| Архивирование | archiver (ZIP, DEFLATE) |
| Хранилище | Selectel Object Storage (S3-совместимое, РФ) |
| Оплата | Т-Банк Эквайринг (рекуррентные, 54-ФЗ) |
| Хостинг | Selectel VPS (152-ФЗ, данные в РФ) |

---

## Деплой на Selectel

```bash
# 1. Создать VPS Ubuntu 22.04 в Selectel (Москва)
# 2. Установить Docker
curl -fsSL https://get.docker.com | sh

# 3. Клонировать и настроить
git clone https://github.com/yourname/pixtager && cd pixtager
cp .env.example .env && nano .env

# 4. Запустить
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy

# 5. Nginx + SSL (certbot)
apt install nginx certbot python3-certbot-nginx
certbot --nginx -d pixtager.ru -d www.pixtager.ru
```

---

## Переменные окружения

| Переменная | Описание | Где получить |
|-----------|----------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Selectel DB |
| `REDIS_URL` | Redis connection string | Upstash / self-hosted |
| `YANDEX_GEOCODER_KEY` | Яндекс Геокодер API ключ | [developer.tech.yandex.ru](https://developer.tech.yandex.ru/) |
| `TINKOFF_TERMINAL_KEY` | Терминал Т-Банк | [tbank.ru/kassa](https://www.tbank.ru/kassa/) |
| `TINKOFF_PASSWORD` | Пароль терминала Т-Банк | [tbank.ru/kassa](https://www.tbank.ru/kassa/) |
| `JWT_SECRET` | Секрет для подписи токенов | Сгенерировать: `openssl rand -hex 32` |

---

## Дорожная карта

- [ ] Авторизация через Google OAuth
- [ ] Bulk CSV-импорт (разные данные для каждого фото)
- [ ] REST API для агентств (документация OpenAPI)
- [ ] Интеграция с Яндекс Бизнес
- [ ] Telegram-бот для уведомлений о готовности
- [ ] White-label режим для агентств
- [ ] Статистика по SEO-ключевым словам
