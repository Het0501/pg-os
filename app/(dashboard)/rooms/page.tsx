import type { Metadata } from 'next'
import { RoomsManagement } from '@/components/rooms/rooms-management'

export const metadata: Metadata = {
  title: 'Rooms & Beds',
  description: 'Explore rooms, occupants, bed availability, and monthly rents across your PG properties. Mock workspace preview.',
}

export default async function RoomsPage({ searchParams }: { searchParams: Promise<{ room?: string | string[]; bed?: string | string[]; property?: string | string[] }> }) {
  const params = await searchParams
  const roomId = typeof params.room === 'string' ? params.room : undefined
  const bedId = typeof params.bed === 'string' ? params.bed : undefined
  const propertyId = typeof params.property === 'string' ? params.property : undefined
  return <RoomsManagement key={`${roomId ?? 'all'}:${bedId ?? ''}:${propertyId ?? ''}`} initialRoomId={roomId} initialBedId={bedId} initialPropertyId={propertyId} />
}
