'use client'

import { usePrototype } from '@/lib/prototype-store'
import { financials } from '@/lib/financials'
import { BedDouble, Building2, CircleDashed, Wallet, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { properties, rupees, type Property } from '@/lib/properties'

export function PropertySummary({ property }: { property?: Property }) {
  const items = property ? [property] : properties
  const { beds, occupied, vacant, reserved, maintenance, rooms, collected: revenue, occupancy } = financials(usePrototype(), property?.id)
  const detail = `${occupied} occupied · ${vacant} vacant · ${reserved} reserved · ${maintenance} maintenance`
  const metrics: { label: string; value: string; detail: string; icon: LucideIcon; highlight?: boolean }[] = [
    { label: property ? 'Total rooms' : 'Properties', value: String(property ? rooms : items.length), detail: property ? `Across ${property.floors} floors` : 'Across Bengaluru', icon: Building2 },
    { label: 'Total beds', value: String(beds), detail, icon: BedDouble },
    { label: 'Occupancy', value: `${occupancy.toFixed(1)}%`, detail: 'Of total bed capacity', icon: CircleDashed, highlight: true },
    { label: 'Monthly revenue', value: rupees(revenue), detail: 'September 2026 · Sample', icon: Wallet },
  ]
  return (
    <section aria-label={property ? 'Property metrics' : 'Portfolio metrics'} className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, detail, icon: Icon, highlight }) => (
        <Card key={label} className="stat-card" data-highlight={highlight}>
          <CardHeader className="flex flex-row items-center justify-between gap-2"><CardTitle><span className="text-[13px] font-normal text-muted-foreground">{label}</span></CardTitle><span className="metric-icon"><Icon className="size-[17px]" strokeWidth={1.7} /></span></CardHeader>
          <CardContent><p className="text-[28px] leading-tight font-medium tracking-[-0.045em] tabular-nums">{value}</p><p className="mt-2 text-[11px] text-muted-foreground">{detail}</p></CardContent>
        </Card>
      ))}
    </section>
  )
}

export function Occupancy({ occupied, beds }: { occupied: number; beds: number }) {
  const percentage = beds ? occupied / beds * 100 : 0
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Occupancy</span><span className="font-medium text-primary tabular-nums">{percentage.toFixed(1)}%</span></div>
      <div role="meter" aria-label="Bed occupancy" aria-valuemin={0} aria-valuemax={beds} aria-valuenow={occupied} aria-valuetext={`${occupied} of ${beds} beds occupied`} className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} /></div>
    </div>
  )
}
