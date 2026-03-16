// src/app/dashboard/billing/page.tsx
import type { Metadata } from 'next'
import { DashboardBilling } from '@/components/pages/DashboardBilling'
export const metadata: Metadata = { title: 'Тариф и оплата' }
export default function BillingPage() { return <DashboardBilling /> }
