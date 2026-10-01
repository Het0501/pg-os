import type { PrototypeState } from '@/lib/prototype-store'
import { roomSummary } from '@/lib/rooms'
import { demoMonth } from '@/lib/rent'
export function financials(state: PrototypeState, propertyId = 'all', month = demoMonth) {
  const matches = (item: { propertyId: string }) => propertyId === 'all' || item.propertyId === propertyId
  const tenants = state.tenants.filter(matches)
  const rooms = state.rooms.filter(matches)
  const payments = state.payments.filter(item => matches(item) && (month === 'all' || item.date.startsWith(month)))
  const expenses = state.expenses.filter(item => matches(item) && (month === 'all' || item.date.startsWith(month)))
  const collected = payments.reduce((sum, item) => sum + item.amount, 0)
  const spent = expenses.reduce((sum, item) => sum + item.amount, 0)
  const expected = tenants.reduce((sum, item) => sum + item.rent, 0)
  const pending = tenants.reduce((sum, item) => sum + item.outstanding, 0)
  return { tenants, payments, expenses, expected, pending, collected, spent, profit: collected - spent, rate: expected ? (expected - pending) / expected * 100 : 0, ...roomSummary(rooms), roomInventory: rooms }
}
