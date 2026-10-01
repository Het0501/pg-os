import type { Tenant } from '@/lib/tenants'
export const demoToday = '2026-09-21'
export const demoMonth = '2026-09'
export const paymentMethods = ['UPI', 'Bank transfer', 'Cash', 'Cheque'] as const
export type Payment = { id: string; tenantId: string; propertyId: string; amount: number; date: string; method: string; reference: string }
export function seedPayments(tenants: Tenant[]): Payment[] {
  return tenants.flatMap(tenant => tenant.lastPayment ? [{ id: `seed-${tenant.id}`, tenantId: tenant.id, propertyId: tenant.propertyId, ...tenant.lastPayment, method: 'UPI', reference: 'Sample payment' }] : [])
}
export function rentTotals(tenants: Tenant[]) {
  const expected = tenants.reduce((sum, item) => sum + item.rent, 0)
  const pending = tenants.reduce((sum, item) => sum + item.outstanding, 0)
  const collected = expected - pending
  return { expected, pending, collected, overdue: tenants.filter(item => item.payment === 'Overdue').reduce((sum, item) => sum + item.outstanding, 0), rate: expected ? collected / expected * 100 : 0 }
}
