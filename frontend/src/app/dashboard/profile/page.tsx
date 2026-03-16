// src/app/dashboard/profile/page.tsx
import type { Metadata } from 'next'
import { DashboardProfile } from '@/components/pages/DashboardProfile'
export const metadata: Metadata = { title: 'Профиль' }
export default function ProfilePage() { return <DashboardProfile /> }
