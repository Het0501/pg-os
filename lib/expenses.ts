import { properties } from '@/lib/properties'
export const expenseCategories = ['Electricity', 'Water', 'Internet', 'Food', 'Staff Salary', 'Maintenance', 'Rent/Lease', 'Cleaning', 'Supplies', 'Other'] as const
export type Expense = { id: string; category: string; propertyId: string; description: string; amount: number; date: string; addedBy: string; notes: string; ticketId?: string }
export function seedExpenses(): Expense[] {
  return properties.flatMap(property => ['2026-08', '2026-09'].flatMap(month => {
    const total = month === '2026-09' ? property.expenses : Math.round(property.expenses * .96)
    const categories = [['Rent/Lease', .5], ['Food', .25], ['Staff Salary', .15], ['Electricity', .1]] as const
    return categories.map(([category, ratio], index) => ({ id: `${month}-${property.id}-${index}`, category, propertyId: property.id, description: `${category} · ${month === '2026-09' ? 'September' : 'August'} operations`, amount: total * ratio, date: `${month}-${String(index + 2).padStart(2, '0')}`, addedBy: 'Rajesh Kumar', notes: 'Sample expense' }))
  }))
}
export function expenseTotal(expenses: Expense[], month = '2026-09') { return expenses.filter(item => item.date.startsWith(month)).reduce((sum, item) => sum + item.amount, 0) }
