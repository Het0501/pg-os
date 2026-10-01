'use client'

import { useState } from 'react'
import { Bell, History, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { TenantStatus } from '@/components/tenants/tenant-card'
import { DemoFooter, Filter, Metrics, NoResults, Notice, PageHeader, PropertyFilter } from '@/components/operations/shared'
import { PaymentForm } from './payment-form'
import { usePrototype } from '@/lib/prototype-store'
import { rupees } from '@/lib/properties'
import { formatDate, tenantStay, paymentStatuses } from '@/lib/tenants'
import { rentTotals } from '@/lib/rent'

export function RentManagement() {
  const { tenants, rooms, payments } = usePrototype()
  const [property, setProperty] = useState('all')
  const [status, setStatus] = useState('all')
  const [due, setDue] = useState('all')
  const [paying, setPaying] = useState<string | null>(null)
  const [history, setHistory] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const scoped = tenants.filter(item => property === 'all' || item.propertyId === property)
  const visible = scoped.filter(item => (status === 'all' || item.payment === status) && (due === 'all' || (due === 'overdue' ? item.outstanding > 0 && item.dueDay < 21 : item.outstanding > 0 && item.dueDay >= 21)))
  const totals = rentTotals(scoped)
  const tenant = tenants.find(item => item.id === paying)
  const historyTenant = tenants.find(item => item.id === history)
  const historyItems = payments.filter(item => item.tenantId === history).sort((a, b) => b.date.localeCompare(a.date))
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8"><PageHeader eyebrow="Healthy cash flow, happy homes" title="Rent & Payments" description="Every rent payment, every balance. Nothing slips through the cracks." /><Metrics items={[{ label: 'Expected rent', value: rupees(totals.expected) }, { label: 'Collected', value: rupees(totals.collected) }, { label: 'Pending', value: rupees(totals.pending) }, { label: 'Overdue', value: rupees(totals.overdue) }, { label: 'Collection rate', value: `${totals.rate.toFixed(1)}%` }]} /><Notice message={notice} /><FieldGroup className="flex flex-wrap gap-4 sm:flex-row"><PropertyFilter value={property} onChange={setProperty} /><Filter label="Payment status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All payments' }, ...paymentStatuses.map(value => ({ value, label: value }))]} /><Filter label="Due status" value={due} onChange={setDue} options={[{ value: 'all', label: 'All due dates' }, { value: 'overdue', label: 'Past due' }, { value: 'upcoming', label: 'Due soon' }]} /></FieldGroup><section className="min-w-0 rounded-xl border border-border bg-card p-4" aria-label="Tenant rent ledger"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-medium">September rent ledger</h2><span className="text-xs text-muted-foreground">{visible.length} tenants</span></div>{visible.length ? <Table><TableHeader><TableRow>{['Tenant', 'Property / Room / Bed', 'Monthly rent', 'Due date', 'Status', 'Outstanding', 'Actions'].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(item => { const stay = tenantStay(item, rooms); return <TableRow key={item.id}><TableCell>{item.name}</TableCell><TableCell><p>{stay.property.name}</p><p className="mt-1 text-xs text-muted-foreground">Room {stay.room} · Bed {stay.bed}</p></TableCell><TableCell>{rupees(item.rent)}</TableCell><TableCell>{item.dueDay} Sep 2026</TableCell><TableCell><TenantStatus status={item.payment} /></TableCell><TableCell>{rupees(item.outstanding)}</TableCell><TableCell><div className="flex gap-1"><Button size="icon-sm" variant="ghost" aria-label={`Record payment for ${item.name}`} disabled={!item.outstanding} onClick={() => setPaying(item.id)}><Wallet /></Button><Button size="icon-sm" variant="ghost" aria-label={`Send reminder to ${item.name}`} disabled={!item.outstanding} onClick={() => setNotice(`Reminder sent to ${item.name} (simulated). No message was delivered.`)}><Bell /></Button><Button size="icon-sm" variant="ghost" aria-label={`View history for ${item.name}`} onClick={() => setHistory(item.id)}><History /></Button></div></TableCell></TableRow> })}</TableBody></Table> : <NoResults />}</section><DemoFooter />{tenant && <PaymentForm tenant={tenant} onClose={() => setPaying(null)} onSaved={() => setNotice('Payment recorded. Tenant balance and shared financial totals updated.')} />}{historyTenant && <Sheet open onOpenChange={open => { if (!open) setHistory(null) }}><SheetContent className="overflow-y-auto"><SheetHeader className="p-6 pr-12"><SheetTitle>Payment history</SheetTitle><SheetDescription>{historyTenant.name} · Sample transactions</SheetDescription></SheetHeader><div className="flex flex-col gap-4 px-6">{historyItems.length ? historyItems.map(payment => <article key={payment.id} className="rounded-xl border border-border p-4"><div className="flex justify-between gap-4"><strong>{rupees(payment.amount)}</strong><span className="text-xs text-muted-foreground">{formatDate(payment.date)}</span></div><p className="mt-2 text-xs text-muted-foreground">{payment.method} · {payment.reference || 'No reference'}</p></article>) : <NoResults />}</div></SheetContent></Sheet>}</div>
}
