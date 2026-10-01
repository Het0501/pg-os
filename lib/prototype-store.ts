'use client'

import useSWR from 'swr'
import { useMemo } from 'react'
import { deriveNotifications } from '@/lib/notifications'
import { createMockRooms, type Room } from '@/lib/rooms'
import { createMockTenants, type Tenant } from '@/lib/tenants'

import { seedPayments, type Payment } from '@/lib/rent'

import { seedExpenses, type Expense } from '@/lib/expenses'

import { seedMaintenance, type MaintenanceTicket } from '@/lib/maintenance'
import { demoDate } from '@/lib/vacancies'

import { seedLeads, admitResident, type Lead, type Onboarding, type Assignment } from '@/lib/leads'

export type PrototypeState = { rooms: Room[]; tenants: Tenant[]; payments: Payment[]; expenses: Expense[]; maintenance: MaintenanceTicket[]; readNotificationIds: string[]; leads: Lead[]; onboarding: Onboarding[] }
const tenants = createMockTenants()
const initialState: PrototypeState = { rooms: createMockRooms(), tenants, payments: seedPayments(tenants), expenses: seedExpenses(), maintenance: seedMaintenance(tenants), readNotificationIds: [], leads: seedLeads, onboarding: [] }
const key = 'pg-os-prototype'
export function usePrototype() {
  const { data = initialState, mutate } = useSWR<PrototypeState>(key, null, { fallbackData: initialState, revalidateOnFocus: false })
  function update(transform: (state: PrototypeState) => PrototypeState) {
    return mutate(current => transform(current ?? initialState), { revalidate: false })
  }
  async function recordPayment(payment: Payment) {
    let accepted = false
    await update(state => {
      const tenant = state.tenants.find(item => item.id === payment.tenantId)
      if (!tenant || !Number.isInteger(payment.amount) || payment.amount <= 0 || payment.amount > tenant.outstanding || state.payments.some(item => item.id === payment.id)) return state
      accepted = true
      return { ...state, payments: [payment, ...state.payments], tenants: state.tenants.map(item => item.id !== tenant.id ? item : { ...item, outstanding: item.outstanding - payment.amount, payment: item.outstanding === payment.amount ? 'Paid' : item.payment, lastPayment: { amount: payment.amount, date: payment.date } }) }
    })
    return accepted
  }
  async function saveTicket(ticket: MaintenanceTicket) {
    let accepted = false
    await update(state => {
      const previous = state.maintenance.find(item => item.id === ticket.id)
      if (!previous || !Number.isInteger(ticket.cost) || ticket.cost < 0 || ticket.cost > 1000000 || (ticket.status !== 'Open' && !ticket.technician.trim())) return state
      const order = ['Open', 'Assigned', 'In Progress', 'Resolved']
      if (order.indexOf(ticket.status) < order.indexOf(previous.status) || order.indexOf(ticket.status) > order.indexOf(previous.status) + 1) return state
      accepted = true
      const saved = { ...ticket, resolutionDate: ticket.status === 'Resolved' ? previous.resolutionDate || demoDate : '' }
      const expenses = state.expenses.filter(item => item.ticketId !== ticket.id)
      if (saved.cost > 0) expenses.unshift({ id: `maintenance-${ticket.id}`, ticketId: ticket.id, category: 'Maintenance', propertyId: ticket.propertyId, description: ticket.description, amount: ticket.cost, date: demoDate, addedBy: 'Rajesh Kumar', notes: `Technician: ${ticket.technician || 'Unassigned'}` })
      return { ...state, maintenance: state.maintenance.map(item => item.id === saved.id ? saved : item), expenses }
    })
    return accepted
  }
  const notifications = useMemo(() => deriveNotifications(data), [data.tenants, data.rooms, data.maintenance])
  const readNotificationIds = data.readNotificationIds ?? []
  const unreadCount = notifications.filter(item => !readNotificationIds.includes(item.id)).length
  function markNotificationRead(id: string) {
    return update(state => ({ ...state, readNotificationIds: [...new Set([...(state.readNotificationIds ?? []), id])] }))
  }
  function markAllNotificationsRead() {
    return update(state => ({ ...state, readNotificationIds: [...new Set([...(state.readNotificationIds ?? []), ...deriveNotifications(state).map(item => item.id)])] }))
  }
  async function admit(kind: 'lead' | 'onboarding', id: string, assignment: Assignment) {
    await update(state => admitResident(state, kind, id, assignment))
  }
  return { ...data, readNotificationIds, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, update, recordPayment, saveTicket, admit }
}
