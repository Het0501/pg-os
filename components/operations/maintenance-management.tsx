'use client'
import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, Metrics, PropertyFilter, Filter, Notice, NoResults, DemoFooter } from './shared'
import { usePrototype } from '@/lib/prototype-store'
import { maintenanceStatuses, type MaintenanceTicket } from '@/lib/maintenance'
import { properties, rupees } from '@/lib/properties'
import { formatDate } from '@/lib/tenants'

export function MaintenanceManagement() {
  const { maintenance, rooms, tenants, saveTicket } = usePrototype()
  const [property, setProperty] = useState('all')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState<MaintenanceTicket | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const scoped = maintenance.filter(t => property === 'all' || t.propertyId === property)
  const visible = scoped.filter(t => status === 'all' || t.status === status)
  async function save() {
    if (!editing) return
    setBusy(true)
    const accepted = await saveTicket(editing)
    setBusy(false)
    if (!accepted) { setError('Assign a technician before progressing. Cost must be a whole amount from ₹0 to ₹10,00,000. Advance one step at a time.'); return }
    setNotice(`Maintenance #${editing.id} updated. ${editing.cost ? `${rupees(editing.cost)} recorded in shared expenses (no duplicate entry).` : 'No cost recorded yet.'}`)
    setEditing(null)
  }
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8">
    <PageHeader eyebrow="Keep every home running" title="Maintenance" description="From the first report to the final repair. Every issue, connected." />
    <Metrics items={[{ label: 'Total tickets', value: scoped.length }, ...maintenanceStatuses.map(s => ({ label: s, value: scoped.filter(t => t.status === s).length }))]} />
    <Notice message={notice} />
    <FieldGroup className="flex flex-wrap gap-4 sm:flex-row"><PropertyFilter value={property} onChange={setProperty} /><Filter label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All statuses' }, ...maintenanceStatuses.map(s => ({ value: s, label: s }))]} /></FieldGroup>
    <section className="min-w-0 rounded-xl border border-border bg-card p-4" aria-label="Maintenance tickets"><h2 className="mb-5 text-sm font-medium">Maintenance tickets · {visible.length}</h2>{visible.length ? <Table><TableHeader><TableRow>{['Ticket / issue', 'Resident / location', 'Priority', 'Technician', 'Status', 'Cost', 'Action'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(t => <TableRow key={t.id}><TableCell><p>#{t.id} · {t.description}</p><p className="mt-1 text-xs text-muted-foreground">{t.category} · {formatDate(t.createdDate)}</p></TableCell><TableCell><p>{tenants.find(x => x.id === t.tenantId)?.name}</p><p className="mt-1 text-xs text-muted-foreground">{properties.find(p => p.id === t.propertyId)?.name} · Room {rooms.find(r => r.id === t.roomId)?.number}</p></TableCell><TableCell><Badge variant="outline">{t.priority}</Badge></TableCell><TableCell>{t.technician || 'Unassigned'}</TableCell><TableCell><Badge variant={t.status === 'Resolved' ? 'secondary' : 'outline'}>{t.status}</Badge></TableCell><TableCell>{rupees(t.cost)}</TableCell><TableCell><Button variant="outline" size="sm" onClick={() => { setEditing({ ...t }); setError('') }} aria-label={`Manage ticket ${t.id}`}><Wrench data-icon="inline-start" />Manage</Button></TableCell></TableRow>)}</TableBody></Table> : <NoResults />}</section>
    <DemoFooter />
    {editing && <Sheet open onOpenChange={open => { if (!open) setEditing(null) }}><SheetContent className="overflow-y-auto"><SheetHeader><SheetTitle>Maintenance #{editing.id}</SheetTitle><SheetDescription>{editing.description} · {editing.category} · {editing.priority} priority</SheetDescription></SheetHeader><form className="flex flex-col gap-6 p-6" onSubmit={e => { e.preventDefault(); void save() }}><p className="text-xs text-muted-foreground">Open → Assigned → In Progress → Resolved</p><FieldGroup><Field><FieldLabel htmlFor="technician">Assigned technician</FieldLabel><Input id="technician" placeholder="e.g. Ramesh" maxLength={80} value={editing.technician} onChange={e => setEditing({ ...editing, technician: e.target.value })} /></Field><Filter label="Ticket status" value={editing.status} onChange={status => setEditing({ ...editing, status: status as MaintenanceTicket['status'] })} options={maintenanceStatuses.filter((_, i) => { const current = maintenanceStatuses.indexOf(maintenance.find(t => t.id === editing.id)!.status); return i === current || i === current + 1 }).map(s => ({ value: s, label: s }))} /><Field><FieldLabel htmlFor="maintenance-cost">Cost (₹)</FieldLabel><Input id="maintenance-cost" type="number" min={0} max={1000000} step={1} required value={editing.cost} onChange={e => setEditing({ ...editing, cost: Number(e.target.value) })} /><p className="text-xs text-muted-foreground">Saving a cost creates or updates one linked expense.</p></Field></FieldGroup><p className="text-xs text-muted-foreground">Created {formatDate(editing.createdDate)}{editing.resolutionDate && ` · Resolved ${formatDate(editing.resolutionDate)}`}</p>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy}>{editing.status === 'Resolved' ? 'Save resolution & cost' : 'Save ticket'}</Button></form></SheetContent></Sheet>}
  </div>
}
