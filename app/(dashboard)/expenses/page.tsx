import type { Metadata } from 'next'
import { ExpensesManagement } from '@/components/expenses/expenses-management'
export const metadata: Metadata = { title: 'Expenses', description: 'Track PG operating expenses by property and category.' }
export default function ExpensesPage() { return <ExpensesManagement /> }
