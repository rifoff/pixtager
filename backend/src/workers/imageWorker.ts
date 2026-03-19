// src/workers/imageWorker.ts
// Run with: node --loader ts-node/esm src/workers/imageWorker.ts
import { Worker, Job } from 'bullmq'
import { ExifTool } from 'exiftool-vendored'
import archiver from 'archiver'
import { createWriteStream, createReadStream } from 'fs'
import { readFile, writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { prisma } from '../lib/prisma.js'
import { redisConnection } from '../lib/queue.js'
import { generateSlug, generateAlt, generateGeoKeywords } from '../lib/seo.js'
import { geocodeAddress } from '../services/geocoder.js'
import 'dotenv/config'

const exiftool = new ExifTool({ taskTimeoutMillis: 10000 })

interface ProcessJobPayload {
  jobId: string
}

const worker = new Worker<ProcessJobPayload>(
  'image-processing',
  async (job: Job<ProcessJobPayload>) => {
    const { jobId } = job.data
    const log = (msg: string) => job.log(msg)

    log(`Начинаем обработку задания ${jobId}`)

    // Load job from DB
    const dbJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: { settings: true, files: true, user: true },
    })
    if (!dbJob || !dbJob.settings) throw new Error(`Job ${jobId} не найден`)

    await prisma.job.update({ where: { id: jobId }, data: { status: 'PROCESSING' } })

    const s = dbJob.settings
    const uploadDir = process.env.UPLOAD_DIR || '/tmp/pixtager'
    const outputDir = path.join(uploadDir, jobId, 'output')
    await mkdir(outputDir, { recursive: true })

    // Step 1: Geocode address
    log(`Геокодирование: ${s.address}`)
    let lat = s.gpsLat
    let lon = s.gpsLon
    if (!lat || !lon) {
      try {
        const geo = await geocodeAddress(s.address)
        lat = geo.lat
        lon = geo.lon
        log(`GPS получены: ${lat}, ${lon}`)
      } catch {
        log('Геокодирование не удалось, GPS пропускаем')
      }
    }

    // Step 2: Build full keyword list
    const baseKeywords = s.keywords || []
    const geoKeywords = s.mode === 'GEO_SEO'
      ? generateGeoKeywords(baseKeywords[0] || s.businessName, s.city)
      : []
    const allKeywords = [...new Set([...baseKeywords, ...geoKeywords])]

    // Step 3: Process each file
    const processedFiles: string[] = []
    let processed = 0

    for (const file of dbJob.files) {
      const inputPath = path.join(uploadDir, file.storageKey)
      const ext = path.extname(file.originalName).toLowerCase() || '.jpg'
      const slug = generateSlug(s.businessName, s.city, s.niche, processed)
      const newName = `${slug}${ext}`
      const outputPath = path.join(outputDir, newName)

      log(`Обработка: ${file.originalName} → ${newName}`)

      try {
        // Copy file to output
        const fileData = await readFile(inputPath)
        await writeFile(outputPath, fileData)

        // Build IPTC/EXIF metadata payload
        const altTag = generateAlt(s.businessName, s.city, s.mode, s.niche)

        const iptcData: Record<string, unknown> = {
          // IPTC Core
          'IPTC:ObjectName': s.businessName,
          'IPTC:Caption-Abstract': altTag,
          'IPTC:Keywords': allKeywords,
          'IPTC:By-line': s.author || s.businessName,
          'IPTC:CopyrightNotice': s.copyright || `© ${new Date().getFullYear()} ${s.businessName}`,
          'IPTC:City': s.city,
          'IPTC:Country-PrimaryLocationName': s.country,
          'IPTC:Sub-location': s.address,

          // XMP (for better search engine support)
          'XMP:Title': s.businessName,
          'XMP:Description': altTag,
          'XMP:Subject': allKeywords,
          'XMP:Creator': s.author || s.businessName,
          'XMP:Rights': s.copyright || `© ${new Date().getFullYear()} ${s.businessName}`,
          'XMP:Location': s.address,

          // EXIF
          'EXIF:ImageDescription': altTag,
          'EXIF:Artist': s.author || s.businessName,
          'EXIF:Copyright': s.copyright || `© ${new Date().getFullYear()} ${s.businessName}`,
        }

        // Add GPS if available
        if (lat && lon) {
          Object.assign(iptcData, {
            'GPS:GPSLatitude': Math.abs(lat),
            'GPS:GPSLatitudeRef': lat >= 0 ? 'N' : 'S',
            'GPS:GPSLongitude': Math.abs(lon),
            'GPS:GPSLongitudeRef': lon >= 0 ? 'E' : 'W',
          })
        }

        // Mode-specific adjustments
        if (s.mode === 'GOOGLE_MAPS') {
          // English-first for Google Maps
          iptcData['IPTC:Country-PrimaryLocationCode'] = 'RU'
        }
        if (s.mode === 'YANDEX_IMAGES') {
          // Longer description for Yandex Images
          iptcData['IPTC:Caption-Abstract'] = `${altTag}. ${allKeywords.slice(0, 5).join(', ')}.`
        }

        // Write IPTC/EXIF with exiftool
        await exiftool.write(outputPath, iptcData, ['-overwrite_original'])

        // Update DB
        await prisma.jobFile.update({
          where: { id: file.id },
          data: { seoName: newName, altTag, status: 'done' },
        })

        processedFiles.push(outputPath)
        processed++

        await prisma.job.update({ where: { id: jobId }, data: { processed } })
        await job.updateProgress(Math.round((processed / dbJob.files.length) * 90))

      } catch (err) {
        log(`Ошибка при обработке ${file.originalName}: ${err}`)
        await prisma.jobFile.update({ where: { id: file.id }, data: { status: 'failed' } })
      }
    }

    // Step 4: Generate metadata report files
    const allFileData = await prisma.jobFile.findMany({ where: { jobId } })
    const metaHtml = generateMetadataHTML(allFileData, s, processed)
    const metaCsv = generateCSVReport(allFileData, s)
    await writeFile(path.join(outputDir, 'seo-metadata.html'), metaHtml)
    await writeFile(path.join(outputDir, 'seo-report.csv'), metaCsv)

    // Step 5: Pack ZIP
    log('Упаковка ZIP-архива...')
    const zipPath = path.join(uploadDir, jobId, `pixtager-${jobId.slice(0, 8)}.zip`)
    await createZip(outputDir, zipPath)
    await job.updateProgress(100)

    // Save zip URL to DB (in production: upload to Selectel/S3 and store URL)
    const zipUrl = `/api/jobs/${jobId}/download`
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'DONE', zipUrl, processed },
    })
      const dbJobUser = await prisma.job.findUnique({ where: { id: jobId }, select: { userId: true } })
      if (dbJobUser?.userId) {
        await prisma.user.update({
          where: { id: dbJobUser.userId },
          data: { quotaUsed: { increment: processed } },
        })
      }
    log(`Задание ${jobId} завершено. Обработано: ${processed} файлов.`)
    return { jobId, processed, zipPath }
  },
  {
    connection: redisConnection as any,
    concurrency: 3, // Process 3 jobs simultaneously
  }
)

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', async (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
  if (job?.data.jobId) {
    await prisma.job.update({
      where: { id: job.data.jobId },
      data: { status: 'FAILED' },
    })
  }
})

// ============================================================
// ZIP helper
// ============================================================
function createZip(sourceDir: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(destPath)
    const archive = archiver('zip', { zlib: { level: 6 } })
    output.on('close', resolve)
    archive.on('error', reject)
    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}

// ============================================================
// Report generators
// ============================================================
function generateMetadataHTML(files: any[], settings: any, total: number): string {
  // PixTager — branded HTML report
  const rows = files.map(f => `
    <tr>
      <td>${f.originalName}</td>
      <td class="green">${f.seoName || '—'}</td>
      <td>${f.altTag || '—'}</td>
      <td class="mono">${f.status}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">
<title>PixTager — Отчёт</title>
<style>
body{font-family:-apple-system,sans-serif;background:#0e0e0f;color:#f0ede8;padding:32px;line-height:1.6}
h1{font-size:22px;margin-bottom:4px;letter-spacing:-.03em}
p{color:#8a8790;margin-bottom:24px;font-size:14px}
table{width:100%;border-collapse:collapse;background:#161618;border-radius:8px;overflow:hidden}
th{background:#252529;color:#e8b44a;padding:10px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
td{padding:10px 16px;border-bottom:1px solid #2a2a2e;font-size:13px;vertical-align:top}
tr:last-child td{border-bottom:none}
.green{color:#4caf82;font-weight:600;font-family:monospace}
.mono{font-family:monospace;font-size:12px;color:#8a8790}
.meta{background:#1e1e21;border-radius:8px;padding:20px;margin-bottom:24px;font-size:13px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.meta-item label{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#55535a;display:block;margin-bottom:4px}
.meta-item span{color:#f0ede8;font-weight:500}
</style></head><body>
<h1>PixTager — Отчёт по метаданным</h1>
<p>Сгенерировано ${new Date().toLocaleString('ru')} · Режим: ${settings.mode} · Обработано: ${total} файлов</p>
<div class="meta">
  <div class="meta-item"><label>Бизнес</label><span>${settings.businessName}</span></div>
  <div class="meta-item"><label>Адрес</label><span>${settings.address}</span></div>
  <div class="meta-item"><label>Город</label><span>${settings.city}, ${settings.country}</span></div>
  <div class="meta-item"><label>Ниша</label><span>${settings.niche || '—'}</span></div>
  <div class="meta-item"><label>Автор</label><span>${settings.author || '—'}</span></div>
  <div class="meta-item"><label>Копирайт</label><span>${settings.copyright || '—'}</span></div>
</div>
<table>
  <thead><tr><th>Исходное имя</th><th>SEO имя файла</th><th>ALT тег</th><th>Статус</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</body></html>`
}

function generateCSVReport(files: any[], settings: any): string {
  const BOM = '\uFEFF'
  const header = 'Исходное имя,SEO имя файла,ALT тег,Статус\n'
  const rows = files.map(f =>
    `"${f.originalName}","${f.seoName || ''}","${f.altTag || ''}","${f.status}"`
  ).join('\n')
  return BOM + header + rows
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await worker.close()
  await exiftool.end()
  process.exit(0)
})
