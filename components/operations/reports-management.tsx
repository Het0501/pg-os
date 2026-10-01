'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, PropertyFilter, Filter, DemoFooter, NoResults, Notice } from './shared'
import { usePrototype } from '@/lib/prototype-store'
import { properties, rupees } from '@/lib/properties'
import { financials } from '@/lib/financials'
import { vacancies } from '@/lib/vacancies'
import { downloadReport } from '@/lib/report-export'
const types = ['Occupancy', 'Rent Collection', 'Expense', 'Revenue', 'Tenant', 'Vacancy']
export function ReportsManagement() {
  const state = usePrototype()
  const [type, setType] = useState('Occupancy')
  const [property, setProperty] = useState('all')
  const [month, setMonth] = useState('2026-09')
  const [notice, setNotice] = useState('')
  const f = financials(state, property, month)
  const propertyName = (id: string) => properties.find(p => p.id === id)?.name || id
  let columns: string[] = []
  let rows: (string | number)[][] = []
  if (type === 'Occupancy') { columns = ['Property', 'Total beds', 'Occupied', 'Vacant', 'Reserved', 'Maintenance', 'Occupancy']; rows = properties.filter(p => property === 'all' || p.id === property).map(p => { const s = financials(state, p.id); return [p.name, s.beds, s.occupied, s.vacant, s.reserved, s.maintenance, `${s.occupancy.toFixed(1)}%`] }) }
  if (type === 'Rent Collection') { columns = ['Tenant', 'Property', 'Monthly rent', 'Outstanding', 'Status']; rows = f.tenants.map(t => [t.name, propertyName(t.propertyId), rupees(t.rent), rupees(t.outstanding), t.payment]) }
  if (type === 'Expense') { columns = ['Date', 'Property', 'Category', 'Description', 'Amount']; rows = f.expenses.map(e => [e.date, propertyName(e.propertyId), e.category, e.description, rupees(e.amount)]) }
  if (type === 'Revenue') { columns = ['Property', 'Collected', 'Expenses', 'Operating profit']; rows = properties.filter(p => property === 'all' || p.id === property).map(p => { const s = financials(state, p.id, month); return [p.name, rupees(s.collected), rupees(s.spent), rupees(s.profit)] }) }
  if (type === 'Tenant') { columns = ['Tenant', 'Property', 'Room / bed', 'Move-in', 'KYC']; rows = f.tenants.map(t => [t.name, propertyName(t.propertyId), `${state.rooms.find(r => r.id === t.roomId)?.number} / ${state.rooms.flatMap(r => r.beds).find(b => b.id === t.bedId)?.label}`, t.moveIn, t.kyc]) }
  if (type === 'Vacancy') { columns = ['Property', 'Room / bed', 'Rent', 'Days vacant', 'Lost revenue']; rows = vacancies(f.roomInventory).map(v => [propertyName(v.room.propertyId), `${v.room.number} / ${v.bed.label}`, rupees(v.bed.rent), v.days, rupees(v.lost)]) }
  function exportFile(format: 'csv' | 'pdf') { downloadReport(`${type} Report ${property} ${type === 'Expense' || type === 'Revenue' ? month : 'current'}`, columns, rows, format); setNotice(`${format === 'csv' ? 'Excel-compatible CSV' : 'PDF'} downloaded · ${rows.length} rows from current filters.`) }
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8"><PageHeader eyebrow="Clarity you can share" title="Reports" description="One source of truth for your property performance." action={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => exportFile('pdf')}><Download data-icon="inline-start" />Export PDF</Button><Button onClick={() => exportFile('csv')}><Download data-icon="inline-start" />Export Excel</Button></div>} /><Notice message={notice} /><FieldGroup className="flex flex-wrap gap-4 sm:flex-row"><Filter label="Report" value={type} onChange={setType} options={types.map(t => ({ value: t, label: `${t} Report` }))} /><PropertyFilter value={property} onChange={setProperty} />{(type === 'Expense' || type === 'Revenue') && <Filter label="Period" value={month} onChange={setMonth} options={[{ value: '2026-09', label: 'September 2026' }, { value: '2026-08', label: 'August 2026 (partial)' }, { value: 'all', label: 'All dates' }]} />}</FieldGroup><section className="min-w-0 rounded-xl border border-border bg-card p-4"><h2 className="mb-2 text-sm font-medium">{type} Report · {rows.length} records</h2><p className="mb-5 text-xs text-muted-foreground">{type === 'Expense' || type === 'Revenue' ? 'Cash flows for the selected period.' : 'Current inventory and September tenant balances; historical snapshots are not simulated.'} Excel export uses CSV format.</p>{rows.length ? <Table><TableHeader><TableRow>{columns.map(c => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row, i) => <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table> : <NoResults />}</section><DemoFooter /></div>
}
