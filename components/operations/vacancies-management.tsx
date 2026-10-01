'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FieldGroup } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, Metrics, PropertyFilter, NoResults, DemoFooter } from './shared'
import { usePrototype } from '@/lib/prototype-store'
import { properties, rupees } from '@/lib/properties'
import { sharingType, roomSummary } from '@/lib/rooms'
import { vacancies } from '@/lib/vacancies'
export function VacanciesManagement() {
  const { rooms } = usePrototype()
  const [property, setProperty] = useState('all')
  const scoped = rooms.filter(r => property === 'all' || r.propertyId === property)
  const rows = vacancies(scoped)
  const stats = roomSummary(scoped)
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8"><PageHeader eyebrow="Turn empty beds into opportunity" title="Vacancies" description="Live availability from your room inventory. See the cost of every empty bed." /><Metrics items={[{ label: 'Vacant beds', value: rows.length }, { label: 'Estimated lost revenue', value: rupees(rows.reduce((sum, x) => sum + x.lost, 0)) }, { label: 'Daily opportunity', value: rupees(rows.reduce((sum, x) => sum + x.daily, 0)) }, { label: 'Reserved beds', value: stats.reserved }, { label: 'Under maintenance', value: stats.maintenance }]} /><FieldGroup><PropertyFilter value={property} onChange={setProperty} /></FieldGroup><section className="min-w-0 rounded-xl border border-border bg-card p-4" aria-label="Vacant beds"><h2 className="mb-5 text-sm font-medium">Available to assign · {rows.length} beds</h2>{rows.length ? <Table><TableHeader><TableRow>{['Property', 'Room / bed', 'Sharing type', 'Monthly rent', 'Days vacant', 'Estimated lost revenue'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map(({ room, bed, days, daily, lost }) => <TableRow key={bed.id}><TableCell><Link className="hover:underline" href={`/properties/${room.propertyId}`}>{properties.find(p => p.id === room.propertyId)?.name}</Link></TableCell><TableCell>{room.number} · Bed {bed.label}</TableCell><TableCell>{sharingType(room.beds.length)}</TableCell><TableCell>{rupees(bed.rent)}</TableCell><TableCell>{days} days</TableCell><TableCell><p>{rupees(lost)}</p><p className="mt-1 text-xs text-muted-foreground">This vacant bed is costing approximately {rupees(daily)}/day.</p></TableCell></TableRow>)}</TableBody></Table> : <NoResults />}</section><p className="text-xs text-muted-foreground">Estimated loss = monthly rent ÷ 30 × days vacant. Reserved and maintenance beds are not available for assignment.</p><DemoFooter /></div>
}
