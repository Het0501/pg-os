import type { Metadata } from 'next'
import { RentManagement } from '@/components/rent/rent-management'
export const metadata: Metadata = { title: 'Rent & Payments', description: 'Track rent collections, balances and mock payments across your PG properties.' }
export default function RentPage() { return <RentManagement /> }
