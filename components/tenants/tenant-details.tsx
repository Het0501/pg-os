'use client'

import { useState, type ReactNode } from 'react'
import { Bell, CheckCircle2, LogOut, Wallet, Wrench } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { TenantStatus } from '@/components/tenants/tenant-card'
import { rupees } from '@/lib/properties'
import { usePrototype } from '@/lib/prototype-store'
import { formatDate, initials, sampleMonth, tenantStay, type Tenant } from '@/lib/tenants'

function DetailsSection({ title, values }: { title: string; values: [string, ReactNode][] }) {
  return <section className="flex flex-col gap-4"><h3 className="text-sm font-medium">{title}</h3><dl className="grid grid-cols-2 gap-x-4 gap-y-5 text-xs">{values.map(([label, value]) => <div className="min-w-0" key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1.5 break-words font-medium">{value}</dd></div>)}</dl></section>
}

type Action = 'rent' | 'maintenance' | 'moveout'
const titles: Record<Action, string> = { rent: 'Record a mock rent payment', maintenance: 'Raise a mock maintenance request', moveout: 'Confirm move-out' }

export function TenantDetails({ tenant, onClose, onUpdate, onMoveOut }: { tenant: Tenant; onClose: () => void; onUpdate: (tenant: Tenant) => void; onMoveOut: (tenant: Tenant) => void }) {
  const [action, setAction] = useState<Action | null>(null)
  const [notice, setNotice] = useState('')
  const { rooms, recordPayment } = usePrototype()
  const stay = tenantStay(tenant, rooms)

  function confirm() {
    if (action === 'rent') {
      void recordPayment({ id: crypto.randomUUID(), tenantId: tenant.id, propertyId: tenant.propertyId, date: '2026-09-21', amount: tenant.outstanding, method: 'Cash', reference: 'Recorded from tenant profile' })
      setNotice('Mock payment recorded. No money was collected.')
    } else if (action === 'maintenance') {
      setNotice('Mock maintenance request created. No request was sent to staff.')
    } else if (action === 'moveout') {
      onMoveOut(tenant)
    }
    setAction(null)
  }

  return <Sheet open onOpenChange={open => { if (!open) onClose() }}>
    <SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
      <SheetHeader className="p-6 pr-12"><SheetTitle>Tenant profile</SheetTitle><SheetDescription>{stay.property.name} · Room {stay.room} · Bed {stay.bed}</SheetDescription></SheetHeader>
      <div className="flex flex-col gap-6 px-6">
        <div className="flex items-center gap-3"><Avatar size="lg"><AvatarFallback>{initials(tenant.name)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><h2 className="break-words text-lg font-medium">{tenant.name}</h2><p className="mt-1 text-xs text-muted-foreground">Resident since {formatDate(tenant.moveIn)}</p></div></div>
        <div className="grid grid-cols-2 gap-2"><Button disabled={tenant.outstanding === 0} onClick={() => setAction('rent')}><Wallet data-icon="inline-start" />Collect Rent</Button><Button variant="outline" onClick={() => setNotice('Reminder sent (simulated). No SMS or WhatsApp message was sent.')}><Bell data-icon="inline-start" />Send Reminder</Button><Button variant="outline" onClick={() => setAction('maintenance')}><Wrench data-icon="inline-start" />Raise Maintenance</Button><Button variant="outline" onClick={() => setAction('moveout')}><LogOut data-icon="inline-start" />Move Out</Button></div>
        {notice && <Alert role="status"><CheckCircle2 /><AlertTitle>Prototype update</AlertTitle><AlertDescription>{notice}</AlertDescription></Alert>}
        <Separator />
        <DetailsSection title="Personal information" values={[["Full name", tenant.name], ['Phone', tenant.phone], ['Email', tenant.email], ['Date of birth', formatDate(tenant.dob)]]} />
        <Separator />
        <DetailsSection title="Stay information" values={[["Property", stay.property.name], ['Room / Bed', `${stay.room} / ${stay.bed}`], ['Monthly rent', rupees(tenant.rent)], ['Security deposit', rupees(tenant.deposit)], ['Due date', `Day ${tenant.dueDay} of each month`], ['Move-in date', formatDate(tenant.moveIn)], ['Expected move-out', formatDate(tenant.moveOut)]]} />
        <Separator />
        <DetailsSection title="KYC" values={[["KYC status", <TenantStatus key="kyc" status={tenant.kyc} />], ['ID type', tenant.idType], ['ID status', tenant.kyc === 'Complete' ? 'Complete (simulated)' : 'Awaiting review'], ['ID number', tenant.idLastFour ? `•••• ${tenant.idLastFour}` : 'Not provided']]} />
        <Separator />
        <DetailsSection title="Emergency contact" values={[["Name", tenant.emergencyName], ['Relationship', tenant.relationship], ['Phone', tenant.emergencyPhone]]} />
        <Separator />
        <DetailsSection title={`Payment summary · ${sampleMonth}`} values={[["Current month rent", rupees(tenant.rent)], ['Payment status', <TenantStatus key="payment" status={tenant.payment} />], ['Outstanding amount', rupees(tenant.outstanding)], ['Last payment', tenant.lastPayment ? `${rupees(tenant.lastPayment.amount)} · ${formatDate(tenant.lastPayment.date)}` : 'No payments recorded']]} />
        <p className="text-[11px] leading-relaxed text-muted-foreground">Sample profile only. Actions are simulated; no payments, messages, verification or maintenance requests are processed.</p>
      </div>
      <SheetFooter className="p-6"><Button variant="outline" onClick={onClose}>Back to tenants</Button></SheetFooter>
      <Sheet open={action !== null} onOpenChange={open => { if (!open) setAction(null) }}>
        <SheetContent side="bottom" className="mx-auto max-h-[90dvh] max-w-lg overflow-y-auto rounded-t-xl">
          <SheetHeader className="p-6 pr-12"><SheetTitle>{action ? titles[action] : 'Confirm action'}</SheetTitle><SheetDescription>{action === 'rent' ? `Record ${rupees(tenant.outstanding)} for ${tenant.name}. This marks the sample balance as paid without collecting money.` : action === 'moveout' ? `Move ${tenant.name} out of Room ${stay.room}, Bed ${stay.bed}? This removes the tenant from this page only. No deposit refund or final settlement is processed.` : `Create a simulated request for Room ${stay.room}, Bed ${stay.bed}. No staff member will be notified.`}</SheetDescription></SheetHeader>
          <SheetFooter className="p-6 pt-0"><Button variant={action === 'moveout' ? 'destructive' : 'default'} onClick={confirm}>{action === 'rent' ? 'Record mock payment' : action === 'moveout' ? 'Confirm mock move-out' : 'Create mock request'}</Button><Button variant="outline" onClick={() => setAction(null)}>Cancel</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </SheetContent>
  </Sheet>
}
