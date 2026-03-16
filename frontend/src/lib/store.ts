// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanKey, SeoModeKey } from './constants'
import { PLANS } from './constants'

// ── Auth ──────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name?: string
  plan: PlanKey
  quotaUsed: number
  token: string
}

// ── SEO Settings ─────────────────────────────────────────
export interface SeoSettings {
  businessName: string
  address: string
  city: string
  country: string
  author: string
  copyright: string
  niche: string
  keywords: string[]
  mode: SeoModeKey
  gpsLat: number | null
  gpsLon: number | null
}

// ── Job result ────────────────────────────────────────────
export interface ProcessedFile {
  originalName: string
  seoName: string
  altTag: string
  status: string
}

// ── Store ─────────────────────────────────────────────────
interface AppStore {
  // Auth
  user: User | null
  setUser: (u: User | null) => void
  logout: () => void

  // App wizard
  appStep: 'upload' | 'settings' | 'process' | 'download'
  setAppStep: (s: AppStore['appStep']) => void

  // Files
  files: File[]
  addFiles: (f: File[]) => void
  removeFile: (i: number) => void
  clearFiles: () => void

  // Settings
  settings: SeoSettings
  updateSettings: (s: Partial<SeoSettings>) => void

  // Processing
  jobId: string | null
  jobStatus: 'idle' | 'processing' | 'done' | 'failed'
  progress: number
  processedFiles: ProcessedFile[]
  zipUrl: string | null
  setJobId: (id: string) => void
  setJobStatus: (s: AppStore['jobStatus']) => void
  setProgress: (n: number) => void
  setProcessedFiles: (f: ProcessedFile[]) => void
  setZipUrl: (url: string) => void

  resetWizard: () => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Wizard
      appStep: 'upload',
      setAppStep: (appStep) => set({ appStep }),

      // Files
      files: [],
      addFiles: (newFiles) => set(state => {
        const quota = PLANS[state.user?.plan ?? 'FREE'].quota
        return { files: [...state.files, ...newFiles].slice(0, quota) }
      }),
      removeFile: (i) => set(state => ({ files: state.files.filter((_, idx) => idx !== i) })),
      clearFiles: () => set({ files: [] }),

      // Settings
      settings: {
        businessName: '', address: '', city: '', country: 'Россия',
        author: '', copyright: '', niche: '', keywords: [],
        mode: 'YANDEX_MAPS', gpsLat: null, gpsLon: null,
      },
      updateSettings: (s) => set(state => ({ settings: { ...state.settings, ...s } })),

      // Processing
      jobId: null,
      jobStatus: 'idle',
      progress: 0,
      processedFiles: [],
      zipUrl: null,
      setJobId: (jobId) => set({ jobId }),
      setJobStatus: (jobStatus) => set({ jobStatus }),
      setProgress: (progress) => set({ progress }),
      setProcessedFiles: (processedFiles) => set({ processedFiles }),
      setZipUrl: (zipUrl) => set({ zipUrl }),

      resetWizard: () => set({
        files: [], appStep: 'upload', jobId: null,
        jobStatus: 'idle', progress: 0, processedFiles: [], zipUrl: null,
      }),
    }),
    {
      name: 'pixtager-store',
      partialize: (state) => ({ user: state.user, settings: state.settings }),
    }
  )
)
