import { properties, rupees } from '@/lib/properties'
import type { PrototypeState } from '@/lib/prototype-store'
import { demoDate, vacancies } from '@/lib/vacancies'
import { formatDate } from '@/lib/tenants'

export type OperationalNotification = {
  id: string
  kind: 'rent' | 'maintenance' | 'vacancy' | 'attention'
  title: string
  description: string
  href: string
}

export function deriveNotifications(state: Pick<PrototypeState, 'tenants' | 'rooms' | 'maintenance'>): OperationalNotification[] {
  const notifications: OperationalNotification[] = []
  const propertyName = (id: string) => properties.find(property => property.id === id)?.name ?? 'Property'
  for (const tenant of state.tenants) {
    if (tenant.outstanding > 0) notifications.push({
      id: `rent:${tenant.id}:${tenant.outstanding}:${tenant.payment}`,
      kind: 'rent', title: `${tenant.payment === 'Overdue' ? 'Overdue' : 'Pending'} rent · ${tenant.name}`,
      description: `${rupees(tenant.outstanding)} outstanding · ${propertyName(tenant.propertyId)}`,
      href: '/rent',
    })
    if (tenant.kyc === 'Pending') notifications.push({
      id: `kyc:${tenant.id}`, kind: 'attention', title: `KYC pending · ${tenant.name}`,
      description: `Identity verification needs attention · ${propertyName(tenant.propertyId)}`,
      href: `/tenants?tenant=${encodeURIComponent(tenant.id)}`,
    })
    if (tenant.moveOut && tenant.moveOut >= demoDate) notifications.push({
      id: `move-out:${tenant.id}:${tenant.moveOut}`, kind: 'attention', title: `Upcoming move-out · ${tenant.name}`,
      description: `${formatDate(tenant.moveOut)} · Review the stay and prepare the bed.`,
      href: `/tenants?tenant=${encodeURIComponent(tenant.id)}`,
    })
  }
  for (const ticket of state.maintenance) {
    if (ticket.status === 'Resolved') continue
    const room = state.rooms.find(room => room.id === ticket.roomId)
    notifications.push({
      id: `maintenance:${ticket.id}:${ticket.status}:${ticket.priority}`, kind: 'maintenance',
      title: `#${ticket.id} · ${ticket.description}`,
      description: `${ticket.status} · ${ticket.priority} priority · ${propertyName(ticket.propertyId)}${room ? ` · Room ${room.number}` : ''}`,
      href: '/maintenance',
    })
  }
  const available = vacancies(state.rooms)
  for (const property of properties) {
    const beds = available.filter(item => item.room.propertyId === property.id)
    if (!beds.length) continue
    notifications.push({
      id: `vacancy:${property.id}:${beds.map(item => item.bed.id).sort().join(',')}`, kind: 'vacancy',
      title: `${beds.length} vacant ${beds.length === 1 ? 'bed' : 'beds'} · ${property.name}`,
      description: `${rupees(beds.reduce((total, item) => total + item.daily, 0))} potential rent per day. Review availability.`, href: '/vacancies',
    })
  }
  const order = { maintenance: 0, rent: 1, attention: 2, vacancy: 3 }
  return notifications.sort((a, b) => order[a.kind] - order[b.kind])
}
