import type { Property } from '@/lib/properties'
import { roomSummary, sharingType, type Room } from '@/lib/rooms'

export function listingSummary(property: Property, rooms: Room[]) {
  const inventory = rooms.filter(room => room.propertyId === property.id)
  const beds = inventory.flatMap(room => room.beds)
  const available = beds.filter(bed => bed.status === 'vacant')
  const rents = (available.length ? available : beds).map(bed => bed.rent)
  return {
    ...roomSummary(inventory),
    startingRent: rents.length ? Math.min(...rents) : null,
    sharing: [...new Set(inventory.map(room => sharingType(room.beds.length)))],
    food: property.amenities.includes('Meals included'),
    inventory,
  }
}
