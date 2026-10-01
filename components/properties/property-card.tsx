'use client'

import Link from 'next/link'
import { usePrototype } from '@/lib/prototype-store'
import { financials } from '@/lib/financials'
import { ArrowUpRight, Building2, MapPin } from 'lucide-react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Occupancy } from '@/components/properties/property-summary'
import { rupees, type Property } from '@/lib/properties'

export function PropertyCard({ property }: { property: Property }) {
  const { beds, vacant, occupied, rooms, collected } = financials(usePrototype(), property.id)
  return (
    <Card className="h-full [--card-spacing:--spacing(5)]">
      <CardHeader className="gap-3">
        <span className="mb-2 flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-accent text-primary"><Building2 className="size-5" strokeWidth={1.6} /></span>
        <CardAction><Badge variant="outline">Active</Badge></CardAction>
        <CardTitle><h3>{property.name}</h3></CardTitle>
        <CardDescription><span className="flex items-center gap-1.5 text-xs"><MapPin className="size-3.5" />{property.location}, Bengaluru</span></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          {[['Total rooms', rooms], ['Total beds', beds], ['Occupied beds', occupied], ['Vacant beds', vacant]].map(([label, value]) => (
            <div key={label}><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className="mt-1 text-xl font-medium tabular-nums">{value}</dd></div>
          ))}
        </dl>
        <Occupancy occupied={occupied} beds={beds} />
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted-foreground">Monthly revenue</span><span className="text-lg font-medium tracking-tight tabular-nums">{rupees(collected)}</span></div>
      </CardContent>
      <CardFooter className="mt-auto"><Link href={`/properties/${property.id}`} aria-label={`View ${property.name}`} className={buttonVariants({ variant: 'ghost', className: 'w-full justify-between' })}>View property<ArrowUpRight data-icon="inline-end" /></Link></CardFooter>
    </Card>
  )
}
