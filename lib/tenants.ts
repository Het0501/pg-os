import { properties } from '@/lib/properties'
import { createMockRooms, type Room } from '@/lib/rooms'

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue'
export type KycStatus = 'Complete' | 'Pending'
export type Tenant = {
  source?: string; leadId?: string; onboardingId?: string; gender?: string; address?: string; city?: string; state?: string; pincode?: string; occupation?: string; organization?: string; designation?: string
  id: string; name: string; phone: string; email: string; dob: string
  propertyId: string; roomId: string; bedId: string; rent: number; deposit: number
  dueDay: number; moveIn: string; moveOut: string; payment: PaymentStatus; kyc: KycStatus
  idType: string; idLastFour: string; emergencyName: string; relationship: string; emergencyPhone: string
  outstanding: number; lastPayment: { date: string; amount: number } | null
}

export const tenantRooms = createMockRooms()
export const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending', 'Overdue']
export const kycStatuses: KycStatus[] = ['Complete', 'Pending']
export const idTypes = ['Aadhaar', 'PAN', 'Passport', 'Driving licence']
export const sampleMonth = 'September 2026'

export function createMockTenants(): Tenant[] {
  const sample: Tenant[] = ['Rahul Sharma', 'Arjun Patel', 'Karan Shah', 'Aditya Mehta', 'Aman Verma', 'Rohit Singh'].map((name, index) => {
    const propertyId = properties[index < 4 ? 0 : index - 3].id
    const candidates = tenantRooms.filter(room => room.propertyId === propertyId)
    const room = candidates.find(room => room.beds.some(bed => bed.tenant === name)) ?? candidates.find(room => room.beds.some(bed => bed.status === 'occupied'))!
    const bed = room.beds.find(bed => bed.tenant === name) ?? room.beds.find(bed => bed.status === 'occupied')!
    name = bed.tenant!
    const payment = paymentStatuses[index % 3]
    return {
      id: `tenant-${index + 1}`, name, phone: `+91 98765 4321${index}`, email: `${name.toLowerCase().replace(' ', '.')}@example.com`, dob: `199${index + 2}-04-12`,
      propertyId, roomId: room.id, bedId: bed.id, rent: bed.rent, deposit: bed.rent * 2, dueDay: payment === 'Pending' ? 25 : 5,
      moveIn: `2026-0${index + 2}-01`, moveOut: '', payment, kyc: index === 2 || index === 4 ? 'Pending' : 'Complete',
      idType: index % 2 ? 'PAN' : 'Aadhaar', idLastFour: `${4321 + index}`, emergencyName: `${['Suresh', 'Mahesh', 'Rajesh', 'Vijay', 'Sunita', 'Anita'][index]} ${name.split(' ')[1]}`,
      relationship: index < 4 ? 'Father' : 'Mother', emergencyPhone: `+91 91234 5678${index}`,
      outstanding: payment === 'Paid' ? 0 : bed.rent,
      lastPayment: { date: payment === 'Paid' ? '2026-09-03' : '2026-08-05', amount: bed.rent },
    }
  })
  const remaining = tenantRooms.flatMap(room => room.beds.filter(bed => bed.status === 'occupied' && !sample.some(t => t.bedId === bed.id)).map(bed => ({ ...sample[0], id: `resident-${bed.id}`, name: bed.tenant!, email: `${bed.id}@example.com`, propertyId: room.propertyId, roomId: room.id, bedId: bed.id, rent: bed.rent, deposit: bed.rent * 2, payment: 'Paid' as const, kyc: 'Complete' as const, outstanding: 0, lastPayment: { date: '2026-09-03', amount: bed.rent } })))
  let pending = 138000
  return [...sample, ...remaining].map((tenant, index) => {
    const outstanding = Math.min(tenant.rent, pending)
    pending -= outstanding
    return { ...tenant, outstanding, payment: outstanding ? (index % 3 === 1 ? 'Pending' : 'Overdue') : 'Paid', dueDay: outstanding && index % 3 === 1 ? 25 : 5, moveOut: index === 2 || index === 3 ? '2026-09-25' : '', lastPayment: outstanding === tenant.rent ? { date: '2026-08-05', amount: tenant.rent } : { date: '2026-09-03', amount: tenant.rent - outstanding } }
  })
}

export function tenantStay(tenant: Tenant, rooms: Room[] = tenantRooms) {
  const room = rooms.find(room => room.id === tenant.roomId)
  return { property: properties.find(property => property.id === tenant.propertyId)!, room: room?.number ?? '—', bed: room?.beds.find(bed => bed.id === tenant.bedId)?.label ?? '—' }
}

export function formatDate(value: string) {
  return value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`)) : 'Not set'
}

export function initials(name: string) { return name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() }
