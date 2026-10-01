import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { properties } from '@/lib/properties'
import { ListingsBrowser } from '@/components/listings/listings-browser'

type Props = { params: Promise<{ id: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = properties.find(item => item.id === id)
  return { title: property ? `${property.name} — ${property.location}` : 'Listing not found', description: property?.description }
}
export default async function ListingPage({ params }: Props) {
  const { id } = await params
  if (!properties.some(property => property.id === id)) notFound()
  return <ListingsBrowser propertyId={id} />
}
