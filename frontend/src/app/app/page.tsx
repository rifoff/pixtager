// src/app/app/page.tsx
import type { Metadata } from 'next'
import { AppShell } from '@/components/pages/AppShell'
export const metadata: Metadata = { title: 'Приложение' }
export default function AppPage() { return <AppShell /> }
