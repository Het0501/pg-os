import type { Metadata } from 'next'
import { ListingsBrowser } from '@/components/listings/listings-browser'

export const metadata: Metadata = { title: 'PG Listings in Bengaluru', description: 'Explore PG residences in Koramangala, BTM and HSR. Compare rent, shared rooms, amenities and available beds, and enquire with the property team.' }
export default function ListingsPage() { return <ListingsBrowser /> }
