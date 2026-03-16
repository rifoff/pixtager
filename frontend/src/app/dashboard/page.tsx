// src/app/dashboard/page.tsx
import type { Metadata } from 'next'
import { DashboardOverview } from '@/components/pages/DashboardOverview'
export const metadata: Metadata = { title: 'Обзор' }
export default function OverviewPage() { return <DashboardOverview /> }
