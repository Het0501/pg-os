'use client'

import { usePrototype } from '@/lib/prototype-store'
import { ArrowUpRight, Building2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { rupees } from '@/lib/properties'
import { formatDate, initials, tenantStay, type Tenant, type PaymentStatus, type KycStatus } from '@/lib/tenants'

export function TenantStatus({ status }: { status: PaymentStatus | KycStatus }) {
  return <Badge variant={status === 'Paid' || status === 'Complete' ? 'default' : status === 'Overdue' ? 'destructive' : 'secondary'}>{status}</Badge>
}

export function TenantCard({ tenant, onOpen }: { tenant: Tenant; onOpen: () => void }) {
  const { rooms } = usePrototype()
  const stay = tenantStay(tenant, rooms)
  return <Card className="min-w-0 ring-border">
    <CardHeader>
      <div className="mb-3 flex items-center justify-between gap-3"><Avatar size="lg"><AvatarFallback>{initials(tenant.name)}</AvatarFallback></Avatar><TenantStatus status={tenant.payment} /></div>
      <CardTitle><button type="button" onClick={onOpen} className="rounded-sm text-left hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">{tenant.name}</button></CardTitle>
      <CardDescription>{tenant.phone}</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Building2 className="size-3.5 shrink-0" />{stay.property.name} · {stay.property.location}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs">
        {[["Room / Bed", `${stay.room} / ${stay.bed}`], ['Monthly rent', rupees(tenant.rent)], ['Due date', `${tenant.dueDay} Sep 2026`], ['Move-in date', formatDate(tenant.moveIn)]].map(([label, value]) => <div key={label}><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className="mt-1.5 font-medium">{value}</dd></div>)}
      </dl>
    </CardContent>
    <CardFooter className="flex flex-wrap justify-between gap-2"><div className="flex items-center gap-2 text-[11px] text-muted-foreground">KYC<TenantStatus status={tenant.kyc} /></div><Button variant="ghost" size="sm" aria-label={`View ${tenant.name}`} onClick={onOpen}>View profile<ArrowUpRight data-icon="inline-end" /></Button></CardFooter>
  </Card>
}
