'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FieldGroup } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, Metrics, PropertyFilter, Filter, Notice, NoResults, DemoFooter } from '@/components/operations/shared'
import { ExpenseForm } from './expense-form'
import { expenseCategories, expenseTotal } from '@/lib/expenses'
import { usePrototype } from '@/lib/prototype-store'
import { properties, rupees } from '@/lib/properties'
import { formatDate } from '@/lib/tenants'
export function ExpensesManagement() {
  const { expenses } = usePrototype()
  const [property, setProperty] = useState('all')
  const [month, setMonth] = useState('2026-09')
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState('')
  const scoped = expenses.filter(item => property === 'all' || item.propertyId === property)
  const visible = scoped.filter(item => month === 'all' || item.date.startsWith(month)).sort((a,b) => b.date.localeCompare(a.date))
  const largest = expenseCategories.map(category => ({ category, total: visible.filter(item => item.category === category).reduce((sum, item) => sum + item.amount, 0) })).sort((a,b) => b.total - a.total)[0]
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8"><PageHeader eyebrow="Every rupee, accounted for" title="Expenses" description="Understand your operating costs, one clear entry at a time." action={<Button onClick={() => setAdding(true)}><Plus data-icon="inline-start" />Add Expense</Button>} /><Metrics items={[{ label: 'Total expenses · all dates', value: rupees(scoped.reduce((sum,item) => sum + item.amount, 0)) }, { label: 'This month', value: rupees(expenseTotal(scoped)) }, { label: 'Previous month', value: rupees(expenseTotal(scoped, '2026-08')) }, { label: 'Largest category', value: largest.total ? largest.category : '—', hint: largest.total ? rupees(largest.total) : undefined }]} /><Notice message={notice} /><FieldGroup className="flex flex-wrap gap-4 sm:flex-row"><PropertyFilter value={property} onChange={setProperty} /><Filter label="Period" value={month} onChange={setMonth} options={[{ value: '2026-09', label: 'September 2026' }, { value: '2026-08', label: 'August 2026' }, { value: 'all', label: 'All dates' }]} /></FieldGroup><section aria-label="Expense ledger" className="min-w-0 rounded-xl border border-border bg-card p-4"><h2 className="mb-5 text-sm font-medium">Expense ledger · {visible.length} entries</h2>{visible.length ? <Table><TableHeader><TableRow>{['Category','Property','Description','Amount','Date','Added by'].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(item => <TableRow key={item.id}><TableCell><Badge variant="secondary">{item.category}</Badge></TableCell><TableCell>{properties.find(property => property.id === item.propertyId)?.name}</TableCell><TableCell><p>{item.description}</p>{item.ticketId && <p className="mt-1 text-xs text-primary">Maintenance #{item.ticketId}</p>}{item.notes && <p className="mt-1 max-w-72 truncate text-xs text-muted-foreground" title={item.notes}>{item.notes}</p>}</TableCell><TableCell>{rupees(item.amount)}</TableCell><TableCell>{formatDate(item.date)}</TableCell><TableCell>{item.addedBy}</TableCell></TableRow>)}</TableBody></Table> : <NoResults />}</section><DemoFooter />{adding && <ExpenseForm onClose={() => setAdding(false)} onSaved={() => setNotice('Expense recorded. Shared expense and financial totals updated.')} />}</div>
}
