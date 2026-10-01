import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Info, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { PropertySummary } from '@/components/properties/property-summary'
import { PropertyDetails } from '@/components/properties/property-details'
import { properties } from '@/lib/properties'

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return properties.map(({ id }) => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = properties.find(item => item.id === id)
  return { title: property?.name ?? 'Property not found' }
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params
  const property = properties.find(item => item.id === id)
  if (!property) notFound()

  return (
    <div className="dashboard-enter flex flex-col gap-8">
      <div className="flex flex-col items-start gap-5">
        <Link href="/properties" className={buttonVariants({ variant: 'ghost', size: 'sm' })}><ArrowLeft data-icon="inline-start" />Back to properties</Link>
        <div><div className="flex flex-wrap items-center gap-3"><h1 className="text-[30px] leading-tight font-medium tracking-[-0.045em]">{property.name}</h1><Badge variant="outline">Active</Badge></div><p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-muted-foreground"><MapPin className="size-3.5" />{property.location}, Bengaluru</p></div>
      </div>
      <PropertySummary property={property} />
      <PropertyDetails property={property} />
      <footer className="flex items-center gap-1.5 border-t border-border pt-4 text-[10px] text-muted-foreground"><Info className="size-3 shrink-0" />Prototype workspace · All property details and figures are sample data.</footer>
    </div>
  )
}
