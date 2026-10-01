'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Info, Plus, Search, ShieldCheck, Users, Wallet } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { TenantCard } from '@/components/tenants/tenant-card'
import { TenantDetails } from '@/components/tenants/tenant-details'
import { TenantForm } from '@/components/tenants/tenant-form'
import { properties, rupees } from '@/lib/properties'
import { kycStatuses, paymentStatuses, sampleMonth, tenantStay, type Tenant } from '@/lib/tenants'
import { usePrototype } from '@/lib/prototype-store'

export function TenantsManagement({ initialTenantId }: { initialTenantId?: string }) {
  const { tenants, rooms, update } = usePrototype()
  const router = useRouter()
  function closeDetails() {
    setSelectedId(null)
    if (initialTenantId) router.replace('/tenants', { scroll: false })
  }
  const setTenants = (transform: (current: Tenant[]) => Tenant[]) => update(state => ({ ...state, tenants: transform(state.tenants) }))
  const [search, setSearch] = useState('')
  const [property, setProperty] = useState('all')
  const [payment, setPayment] = useState('all')
  const [kyc, setKyc] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(initialTenantId ?? null)
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState('')
  const query = search.trim().toLowerCase()
  const visible = tenants.filter(tenant => {
    const stay = tenantStay(tenant, rooms)
    const searchable = `${tenant.name} ${tenant.phone} ${tenant.phone.replace(/\D/g, '')} ${stay.property.name} ${stay.property.location} room ${stay.room} bed ${stay.bed}`.toLowerCase()
    const phoneQuery = query.replace(/[+\s()-]/g, '')
    return (property === 'all' || tenant.propertyId === property) && (payment === 'all' || tenant.payment === payment) && (kyc === 'all' || tenant.kyc === kyc) && (searchable.includes(query) || (/^\d+$/.test(phoneQuery) && tenant.phone.replace(/\D/g, '').includes(phoneQuery)))
  })
  const selected = tenants.find(tenant => tenant.id === selectedId)
  const metrics = [
    { label: 'Active tenants', value: tenants.length, icon: Users },
    { label: 'Rent paid', value: tenants.filter(tenant => tenant.payment === 'Paid').length, icon: CheckCircle2 },
    { label: 'Outstanding rent', value: rupees(tenants.reduce((sum, tenant) => sum + tenant.outstanding, 0)), icon: Wallet },
    { label: 'KYC pending', value: tenants.filter(tenant => tenant.kyc === 'Pending').length, icon: ShieldCheck },
  ]
  function resetFilters() { setSearch(''); setProperty('all'); setPayment('all'); setKyc('all') }
  function addTenant(tenant: Tenant) {
    update(state => {
      const room = state.rooms.find(item => item.id === tenant.roomId && item.propertyId === tenant.propertyId)
      if (!room?.beds.some(bed => bed.id === tenant.bedId && bed.status === 'vacant') || state.tenants.some(item => item.bedId === tenant.bedId)) return state
      return { ...state, tenants: [tenant, ...state.tenants], rooms: state.rooms.map(item => item.id === tenant.roomId ? { ...item, beds: item.beds.map(bed => bed.id === tenant.bedId ? { ...bed, status: 'occupied', tenant: tenant.name } : bed) } : item) }
    })
    resetFilters()
    setNotice(`${tenant.name} added and bed assigned throughout this demo. Changes reset on reload.`)
  }
  function moveOut(tenant: Tenant) {
    update(state => ({ ...state, tenants: state.tenants.filter(item => item.id !== tenant.id), rooms: state.rooms.map(room => room.id === tenant.roomId ? { ...room, beds: room.beds.map(bed => bed.id === tenant.bedId ? { ...bed, status: 'vacant', tenant: undefined } : bed) } : room) }))
    setSelectedId(null)
    setNotice(`${tenant.name} moved out in this preview. The bed is available for another mock tenant on this page.`)
  }

  return <div className="dashboard-enter flex min-w-0 flex-col gap-8">
    <div className="flex flex-wrap items-center justify-between gap-5"><div><p className="section-eyebrow mb-3">People make a place</p><h1 className="text-[30px] leading-tight font-medium tracking-[-0.045em]">Tenants</h1><p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">Every resident, their stay, and the details that matter.</p></div><Button onClick={() => setAdding(true)}><Plus data-icon="inline-start" />Add Tenant</Button></div>
    <section aria-label="Tenant summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon }, index) => <Card key={label} className="stat-card" data-highlight={index === 0}><CardHeader><CardTitle><span className="flex items-center justify-between gap-2 text-[11px] font-normal text-muted-foreground">{label}<Icon className="size-4 shrink-0" aria-hidden="true" /></span></CardTitle></CardHeader><CardContent><p className="metric-value">{value}</p></CardContent></Card>)}</section>
    <div aria-live="polite">{notice && <Alert role="status"><CheckCircle2 /><AlertTitle>Prototype update</AlertTitle><AlertDescription>{notice}</AlertDescription></Alert>}</div>
    <section aria-labelledby="tenant-list-heading" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2.5"><h2 id="tenant-list-heading" className="text-sm font-medium">All tenants</h2><Badge variant="secondary">{tenants.length}</Badge></div><p className="text-[11px] text-muted-foreground">{sampleMonth} · Sample data</p></div>
      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-[2fr_1fr_1fr_1fr]">
        <Field className="sm:col-span-3 xl:col-span-1"><FieldLabel htmlFor="tenant-search">Search tenants</FieldLabel><Input id="tenant-search" placeholder="Name, phone, property, room or bed…" value={search} onChange={event => setSearch(event.target.value)} /></Field>
        <Field><FieldLabel htmlFor="filter-property">Property</FieldLabel><NativeSelect id="filter-property" className="w-full" value={property} onChange={event => setProperty(event.target.value)}><NativeSelectOption value="all">All properties</NativeSelectOption>{properties.map(item => <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>)}</NativeSelect></Field>
        <Field><FieldLabel htmlFor="filter-payment">Payment status</FieldLabel><NativeSelect id="filter-payment" className="w-full" value={payment} onChange={event => setPayment(event.target.value)}><NativeSelectOption value="all">All payments</NativeSelectOption>{paymentStatuses.map(status => <NativeSelectOption key={status}>{status}</NativeSelectOption>)}</NativeSelect></Field>
        <Field><FieldLabel htmlFor="filter-kyc">KYC status</FieldLabel><NativeSelect id="filter-kyc" className="w-full" value={kyc} onChange={event => setKyc(event.target.value)}><NativeSelectOption value="all">All KYC statuses</NativeSelectOption>{kycStatuses.map(status => <NativeSelectOption key={status}>{status}</NativeSelectOption>)}</NativeSelect></Field>
      </FieldGroup>
      <div className="flex min-h-8 items-center justify-between gap-2"><p className="text-[11px] text-muted-foreground" role="status">Showing {visible.length} of {tenants.length} tenants</p>{(query || property !== 'all' || payment !== 'all' || kyc !== 'all') && <Button variant="ghost" size="sm" onClick={resetFilters}>Clear filters</Button>}</div>
      {visible.length ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{visible.map(tenant => <TenantCard key={tenant.id} tenant={tenant} onOpen={() => setSelectedId(tenant.id)} />)}</div> : <Empty className="border py-12"><EmptyHeader><EmptyMedia variant="icon"><Search /></EmptyMedia><EmptyTitle>No tenants found</EmptyTitle><EmptyDescription>Try a different name, room or property, or clear your filters to see all residents.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={resetFilters}>Reset search and filters</Button></EmptyContent></Empty>}
    </section>
    <footer className="flex items-start gap-1.5 border-t border-border pt-4 text-[10px] leading-relaxed text-muted-foreground"><Info className="mt-0.5 size-3 shrink-0" />Prototype workspace · Sample tenant data. Assignments are shared with Rooms & Beds. Demo changes reset on reload.</footer>
    {selected && <TenantDetails key={selected.id} tenant={selected} onClose={closeDetails} onUpdate={updated => setTenants(current => current.map(tenant => tenant.id === updated.id ? updated : tenant))} onMoveOut={moveOut} />}
    {adding && <TenantForm tenants={tenants} rooms={rooms} onClose={() => setAdding(false)} onAdd={addTenant} />}
  </div>
}
