import type { Tenant } from '@/lib/tenants'
export const maintenanceStatuses = ['Open', 'Assigned', 'In Progress', 'Resolved'] as const
export const maintenanceCategories = ['Plumbing', 'Electrical', 'Cleaning', 'Appliance', 'Furniture', 'Internet', 'Other'] as const
export const priorities = ['Low', 'Medium', 'High', 'Urgent'] as const
export type MaintenanceTicket = { id: string; tenantId: string; propertyId: string; roomId: string; category: string; description: string; priority: string; technician: string; status: typeof maintenanceStatuses[number]; createdDate: string; resolutionDate: string; cost: number }
export function seedMaintenance(tenants: Tenant[]): MaintenanceTicket[] {
  return tenants.slice(0, 3).map((tenant, i) => ({ id: String(104 + i), tenantId: tenant.id, propertyId: tenant.propertyId, roomId: tenant.roomId, category: ['Plumbing', 'Internet', 'Electrical'][i], description: ['Bathroom tap leaking', 'Wi-Fi connection drops in the evening', 'Ceiling light needs replacement'][i], priority: ['Medium', 'High', 'Low'][i], technician: '', status: 'Open', createdDate: `2026-09-${18+i}`, resolutionDate: '', cost: 0 }))
}
