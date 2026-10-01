import type { Tenant } from '@/lib/tenants'
import type { PrototypeState } from '@/lib/prototype-store'
import { demoDate } from '@/lib/vacancies'

export const leadStages = ['NEW', 'CONTACTED', 'VISIT', 'RESERVED', 'CONVERTED', 'LOST'] as const
export const leadSources = ['Walk-in', 'Referral', 'Website', 'Instagram', 'Facebook', 'WhatsApp', 'Other'] as const
export type LeadStage = typeof leadStages[number]
export type Lead = { id: string; name: string; phone: string; email: string; source: typeof leadSources[number]; propertyId: string; sharing: string; moveIn: string; budget: number; notes: string; stage: LeadStage; created: string; tenantId?: string }
export type Onboarding = {
  id: string; name: string; phone: string; email: string; dob: string; gender: string; address: string; city: string; state: string; pincode: string;
  emergencyName: string; relationship: string; emergencyPhone: string; occupation: string; organization: string; designation: string;
  idType: string; idLastFour: string; kyc: 'Pending' | 'Complete'; photo: string; document: string; otherDocument: string;
  status: 'Pending approval' | 'Approved'; created: string; tenantId?: string
}
export const seedLeads: Lead[] = [
  { id: 'lead-1', name: 'Vivek Kumar', phone: '+91 90000 11001', email: 'vivek@example.com', source: 'Referral', propertyId: 'sunrise-pg', sharing: 'Triple sharing', moveIn: '2026-09-25', budget: 8000, notes: 'Works nearby. Would like to visit after 6 pm.', stage: 'VISIT', created: '2026-09-18' },
  { id: 'lead-2', name: 'Neha Rao', phone: '+91 90000 11002', email: 'neha@example.com', source: 'Website', propertyId: 'green-nest', sharing: 'Triple sharing', moveIn: '2026-10-01', budget: 7500, notes: 'Looking for meals and reliable Wi-Fi.', stage: 'NEW', created: '2026-09-20' },
  { id: 'lead-3', name: 'Sameer Das', phone: '+91 90000 11003', email: 'sameer@example.com', source: 'Walk-in', propertyId: 'royal-stay', sharing: 'Triple sharing', moveIn: '2026-09-28', budget: 8000, notes: 'Follow up on move-in date.', stage: 'CONTACTED', created: '2026-09-19' },
]
export const validPhone = (value: string) => /^[+\d\s()-]+$/.test(value) && /^\d{10,15}$/.test(value.replace(/\D/g, ''))
export function duplicateResident(state: PrototypeState, person: { email: string; phone: string }) {
  return state.tenants.some(tenant => tenant.email.toLowerCase() === person.email.toLowerCase() || tenant.phone.replace(/\D/g, '') === person.phone.replace(/\D/g, ''))
}
export type Assignment = { propertyId: string; roomId: string; bedId: string; moveIn: string }
export function admitResident(state: PrototypeState, kind: 'lead' | 'onboarding', id: string, assignment: Assignment): PrototypeState {
  const lead = kind === 'lead' ? state.leads.find(item => item.id === id) : undefined
  const application = kind === 'onboarding' ? state.onboarding.find(item => item.id === id) : undefined
  const person = lead ?? application
  if (!person || person.tenantId || lead?.stage === 'LOST' || duplicateResident(state, person)) throw new Error('This person is already a tenant or this record cannot be converted. Reopen a lost lead first.')
  const room = state.rooms.find(item => item.id === assignment.roomId && item.propertyId === assignment.propertyId)
  const bed = room?.beds.find(item => item.id === assignment.bedId && item.status === 'vacant')
  if (!bed || state.tenants.some(item => item.bedId === bed.id)) throw new Error('This bed is no longer available. Select another vacant bed.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(assignment.moveIn) || (application?.dob && application.dob >= assignment.moveIn)) throw new Error('Choose a valid move-in date after the date of birth.')
  const tenant: Tenant = {
    id: crypto.randomUUID(), name: person.name, phone: person.phone, email: person.email, dob: application?.dob ?? '', ...assignment,
    rent: bed.rent, deposit: bed.rent * 2, dueDay: 5, moveOut: '', payment: 'Pending', kyc: application?.kyc ?? 'Pending',
    idType: application?.idType ?? '', idLastFour: application?.idLastFour ?? '', emergencyName: application?.emergencyName ?? '', relationship: application?.relationship ?? '', emergencyPhone: application?.emergencyPhone ?? '', outstanding: bed.rent, lastPayment: null,
    source: lead?.source ?? 'Onboarding', leadId: lead?.id, onboardingId: application?.id,
    gender: application?.gender, address: application?.address, city: application?.city, state: application?.state, pincode: application?.pincode, occupation: application?.occupation, organization: application?.organization, designation: application?.designation,
  }
  return { ...state, tenants: [tenant, ...state.tenants], rooms: state.rooms.map(item => item.id === room!.id ? { ...item, beds: item.beds.map(value => value.id === bed.id ? { ...value, status: 'occupied', tenant: person.name, vacantSince: undefined } : value) } : item), leads: state.leads.map(item => item.id === lead?.id ? { ...item, stage: 'CONVERTED', tenantId: tenant.id } : item), onboarding: state.onboarding.map(item => item.id === application?.id ? { ...item, status: 'Approved', tenantId: tenant.id } : item) }
}
export const createdToday = () => demoDate
