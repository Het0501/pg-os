import type { Metadata } from 'next'
import { Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AddProperty } from '@/components/properties/add-property'
import { PropertyCard } from '@/components/properties/property-card'
import { PropertySummary } from '@/components/properties/property-summary'
import { properties } from '@/lib/properties'

export const metadata: Metadata = { title: 'Properties', description: 'Explore your PG portfolio, bed availability, occupancy, and property performance.' }

export default function PropertiesPage() {
  return (
    <div className="dashboard-enter flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div><p className="section-eyebrow mb-3">Your portfolio, in one place</p><h1 className="text-[30px] leading-tight font-medium tracking-[-0.045em]">Properties</h1><p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">A closer look at every place you manage.</p></div>
        <AddProperty />
      </div>
      <PropertySummary />
      <section aria-labelledby="property-list-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2.5"><h2 id="property-list-heading" className="text-sm font-medium">All properties</h2><Badge variant="secondary">{properties.length}</Badge></div><p className="text-[11px] text-muted-foreground">September 2026 · Monthly snapshot</p></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{properties.map(property => <PropertyCard key={property.id} property={property} />)}</div>
      </section>
      <footer className="flex items-center gap-1.5 border-t border-border pt-4 text-[10px] text-muted-foreground"><Info className="size-3 shrink-0" />Prototype workspace · All properties and figures are sample data.</footer>
    </div>
  )
}
