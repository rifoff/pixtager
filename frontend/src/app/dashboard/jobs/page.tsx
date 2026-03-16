// src/app/dashboard/jobs/page.tsx
import type { Metadata } from 'next'
import { DashboardJobs } from '@/components/pages/DashboardJobs'
export const metadata: Metadata = { title: 'Задания' }
export default function JobsPage() { return <DashboardJobs /> }
