'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ArrowUpRight } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { FieldGroup } from '@/components/ui/field'
import { PageHeader, PropertyFilter, Filter, NoResults, Notice, DemoFooter } from '@/components/operations/shared'
import { IntakeInput, IntakeSelect, choices } from './intake-fields'
import { LeadForm } from './lead-form'
import { AssignmentSheet } from './assignment-sheet'
import { usePrototype } from '@/lib/prototype-store'
import { leadStages, type LeadStage } from '@/lib/leads'
import { properties, rupees } from '@/lib/properties'
import { formatDate } from '@/lib/tenants'

export function LeadsManagement() {
  const { leads, update } = usePrototype()
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('all')
  const [property, setProperty] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editor, setEditor] = useState<string | null>(null)
  const [conversion, setConversion] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const selected = leads.find(lead => lead.id === selectedId)
  const converting = leads.find(lead => lead.id === conversion)
  const visible = leads.filter(lead => `${lead.name} ${lead.phone} ${lead.email} ${lead.source}`.toLowerCase().includes(query.trim().toLowerCase()) && (stage === 'all' || stage === lead.stage) && (property === 'all' || property === lead.propertyId))
  function changeStage(id: string, next: LeadStage) { update(state => ({ ...state, leads: state.leads.map(lead => lead.id === id && !lead.tenantId && next !== 'CONVERTED' ? { ...lead, stage: next } : lead) })); setNotice(`Lead moved to ${next.toLowerCase()}.`) }
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8"><PageHeader eyebrow="From first hello to move-in" title="Leads" description="One connected pipeline. Turn interest into a place to call home." action={<div className="flex flex-wrap gap-2"><Link href="/onboarding" className={buttonVariants({ variant: 'outline' })}>Tenant onboarding</Link><Button onClick={() => setEditor('new')}><Plus data-icon="inline-start" />Add lead</Button></div>} />
    <section aria-label="Lead pipeline" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{leadStages.map(value => <Card key={value} className="stat-card" data-highlight={value === stage}><CardHeader><CardTitle><button onClick={() => setStage(stage === value ? 'all' : value)} aria-pressed={stage === value} className="text-xs text-muted-foreground">{value}</button></CardTitle></CardHeader><CardContent><p className="metric-value">{leads.filter(lead => lead.stage === value).length}</p></CardContent></Card>)}</section>
    <Notice message={notice} /><FieldGroup className="grid gap-3 md:grid-cols-3"><IntakeInput label="Search leads" value={query} placeholder="Name, phone, email or source…" onChange={event => setQuery(event.target.value)} /><Filter label="Filter stage" value={stage} onChange={setStage} options={[{ value: 'all', label: 'All stages' }, ...choices(leadStages)]} /><PropertyFilter value={property} onChange={setProperty} /></FieldGroup>
    <p role="status" className="text-xs text-muted-foreground">{visible.length} matching leads</p>
    {visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(lead => <Card key={lead.id}><CardHeader><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><Badge variant={lead.stage === 'CONVERTED' ? 'default' : 'secondary'}>{lead.stage}</Badge><span className="text-xs text-muted-foreground">{lead.source}</span></div><CardTitle>{lead.name}</CardTitle><CardDescription>{properties.find(p => p.id === lead.propertyId)?.name} · {lead.sharing}</CardDescription></CardHeader><CardContent className="flex flex-col gap-2 text-xs text-muted-foreground"><p>{lead.phone}</p><p>{rupees(lead.budget)} / month · {formatDate(lead.moveIn)}</p><p className="line-clamp-2 min-h-8">{lead.notes || 'No notes yet.'}</p></CardContent><CardFooter><Button variant="outline" className="w-full" onClick={() => setSelectedId(lead.id)}>Open lead<ArrowUpRight data-icon="inline-end" /></Button></CardFooter></Card>)}</div> : <NoResults />}
    <DemoFooter />
    {selected && <Sheet open onOpenChange={open => { if (!open) setSelectedId(null) }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg"><SheetHeader className="p-6 pr-12"><SheetTitle>{selected.name}</SheetTitle><SheetDescription>{selected.source} · Created {formatDate(selected.created)}</SheetDescription></SheetHeader><div className="flex flex-col gap-6 p-6 pt-0"><Badge className="w-fit">{selected.stage}</Badge><dl className="grid gap-4 text-sm">{Object.entries({ Phone: selected.phone, Email: selected.email, Property: properties.find(p => p.id === selected.propertyId)?.name, Sharing: selected.sharing, 'Move-in': formatDate(selected.moveIn), Budget: rupees(selected.budget), Notes: selected.notes || 'No notes' }).map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>)}</dl>{selected.tenantId ? <Link href={`/tenants?tenant=${selected.tenantId}`} className={buttonVariants()}>View converted tenant</Link> : <><IntakeSelect label="Change stage" value={selected.stage} onChange={event => changeStage(selected.id, event.target.value as LeadStage)} options={choices(leadStages.filter(value => value !== 'CONVERTED'))} /><Button disabled={selected.stage === 'LOST'} onClick={() => { setConversion(selected.id); setSelectedId(null) }}>Convert lead</Button><Button variant="outline" onClick={() => { setEditor(selected.id); setSelectedId(null) }}>Edit lead</Button><Button variant="ghost" disabled={selected.stage === 'LOST'} onClick={() => changeStage(selected.id, 'LOST')}>Mark Lost</Button></>}</div></SheetContent></Sheet>}
    {editor && <LeadForm lead={leads.find(lead => lead.id === editor)} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); setNotice('Lead saved to your shared pipeline.') }} />}
    {converting && <AssignmentSheet kind="lead" id={converting.id} name={converting.name} initialProperty={converting.propertyId} initialMoveIn={converting.moveIn} onClose={() => setConversion(null)} onDone={() => { setConversion(null); setNotice(`${converting.name} is now a tenant. The selected bed is occupied and vacancies are updated.`) }} />}
  </div>
}
