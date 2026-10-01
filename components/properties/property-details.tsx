'use client'

import { usePrototype } from '@/lib/prototype-store'
import { financials } from '@/lib/financials'
import { sharingType, roomSummary } from '@/lib/rooms'
import { Building2, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Occupancy } from '@/components/properties/property-summary'
import { rupees, type Property } from '@/lib/properties'

export function PropertyDetails({ property }: { property: Property }) {
  const { beds, vacant, occupied, collected, spent, profit, roomInventory } = financials(usePrototype(), property.id)
  const rooms = roomInventory.map(room => ({ ...room, ...roomSummary([room]) }))
  const floors = [...new Set(roomInventory.map(room => room.floor))].sort((a, b) => a - b)
  return (
    <>
      <div className="grid items-start gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="h-full [--card-spacing:--spacing(5)]">
          <CardHeader><CardTitle><h2>Property overview</h2></CardTitle><CardDescription>A little more about this property.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p className="text-[13px] leading-relaxed text-muted-foreground">{property.description}</p>
            <div className="flex items-start gap-2 text-xs"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><p className="leading-relaxed">{property.address}</p></div>
            <Separator />
            <dl className="grid grid-cols-2 gap-4 text-xs"><div><dt className="text-muted-foreground">Room type</dt><dd className="mt-1.5">{[...new Set(roomInventory.map(room => sharingType(room.beds.length)))].join(', ')}</dd></div><div><dt className="text-muted-foreground">Floors</dt><dd className="mt-1.5">{floors.length} residential floors</dd></div></dl>
            <div className="flex flex-wrap gap-2">{property.amenities.map(amenity => <Badge key={amenity} variant="secondary">{amenity}</Badge>)}</div>
          </CardContent>
        </Card>
        <Card className="h-full [--card-spacing:--spacing(5)]">
          <CardHeader><CardTitle><h2>Financial overview</h2></CardTitle><CardDescription>September 2026 · Sample figures</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-5">
            <dl className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2"><dt className="text-xs text-muted-foreground">Monthly revenue</dt><dd className="text-xl font-medium tabular-nums">{rupees(collected)}</dd></div>
              <div className="flex flex-wrap items-center justify-between gap-2"><dt className="text-xs text-muted-foreground">Monthly expenses</dt><dd className="text-xl font-medium tabular-nums">{rupees(spent)}</dd></div>
            </dl>
            <Separator />
            <dl><div className="flex flex-wrap items-center justify-between gap-2"><dt className="text-xs text-muted-foreground">Net operating income</dt><dd className="text-xl font-medium text-primary tabular-nums">{rupees(profit)}</dd></div></dl>
            <p className="text-[11px] leading-relaxed text-muted-foreground">Shared September totals from recorded rent payments, expenses and maintenance costs.</p>
          </CardContent>
        </Card>
      </div>
      <section aria-labelledby="beds-heading">
        <Card className="[--card-spacing:--spacing(5)]">
          <CardHeader><CardTitle><h2 id="beds-heading">Beds & occupancy</h2></CardTitle><CardDescription>Availability across all {rooms.length} rooms.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <dl className="grid flex-1 grid-cols-3 gap-4">{[['Total beds', beds], ['Occupied', occupied], ['Vacant', vacant]].map(([label, value]) => <div key={label}><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className="mt-1.5 text-2xl font-medium tabular-nums">{value}</dd></div>)}</dl>
            <div className="flex-1"><Occupancy occupied={occupied} beds={beds} /></div>
          </CardContent>
        </Card>
      </section>
      <section aria-labelledby="rooms-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2.5"><h2 id="rooms-heading" className="text-sm font-medium">Rooms</h2><Badge variant="secondary">{rooms.length}</Badge></div><span className="text-[11px] text-muted-foreground">Shared room and bed inventory</span></div>
        {floors.map(floor => (
          <Card key={floor} className="[--card-spacing:--spacing(5)]">
            <CardHeader><CardTitle><h3 className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" />Floor {floor}</h3></CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {rooms.filter(room => room.floor === floor).map(room => (
                <div key={room.number} className="flex flex-col gap-3 rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5"><p className="text-xs font-medium">Room {room.number}</p><span className="text-[10px] text-muted-foreground">{room.occupied}/{room.beds} filled</span></div>
                  <div className="flex gap-1.5" aria-label={`Room ${room.number}: ${room.occupied} occupied beds, ${room.vacant} vacant beds, ${room.reserved} reserved, ${room.maintenance} under maintenance`}>
                    {Array.from({ length: room.beds }, (_, index) => <span key={index} aria-hidden="true" className={index < room.occupied ? 'h-2 flex-1 rounded-sm bg-primary/70' : 'h-2 flex-1 rounded-sm border border-border bg-secondary'} />)}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{room.occupied === room.beds ? 'Fully occupied' : `${room.vacant} available · ${room.reserved} reserved · ${room.maintenance} maintenance`}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}
