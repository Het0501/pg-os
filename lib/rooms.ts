import { properties, propertyRooms } from '@/lib/properties'

export type BedStatus = 'occupied' | 'vacant' | 'reserved' | 'maintenance'
export type Bed = { id: string; label: string; status: BedStatus; tenant?: string; rent: number; vacantSince?: string }
export type Room = { id: string; propertyId: string; number: string; floor: number; beds: Bed[] }

export const bedStatuses: BedStatus[] = ['occupied', 'vacant', 'reserved', 'maintenance']
export const statusLabels: Record<BedStatus, string> = {
  occupied: 'Occupied', vacant: 'Vacant', reserved: 'Reserved', maintenance: 'Maintenance',
}
export const statusColors: Record<BedStatus, string> = {
  occupied: 'text-primary', vacant: 'text-destructive', reserved: 'text-warning', maintenance: 'text-muted-foreground',
}

const firstNames = ['Rahul', 'Arjun', 'Karan', 'Aditya', 'Rohan', 'Vikram', 'Nikhil', 'Aman', 'Varun', 'Sahil', 'Pranav', 'Dev']
const lastNames = ['Sharma', 'Patel', 'Shah', 'Mehta', 'Rao', 'Singh', 'Kumar', 'Joshi', 'Nair', 'Gupta']

export function createMockRooms(): Room[] {
  return properties.flatMap((property, propertyIndex) => {
    let occupant = 0
    return propertyRooms(property).map((room, roomIndex) => ({
      id: `${property.id}-${room.number}`,
      propertyId: property.id,
      number: room.number,
      floor: room.floor,
      beds: Array.from({ length: room.beds }, (_, index): Bed => {
        const status: BedStatus = index < room.occupied ? 'occupied'
          : roomIndex === property.roomCount - 1 ? 'maintenance'
          : roomIndex === property.roomCount - 2 ? 'reserved' : 'vacant'
        const nameIndex = occupant++ + propertyIndex * 4
        return {
          id: `${property.id}-${room.number}-${index}`,
          label: String.fromCharCode(65 + index),
          status,
          tenant: status === 'occupied' ? `${firstNames[nameIndex % firstNames.length]} ${lastNames[(nameIndex + Math.floor(nameIndex / firstNames.length)) % lastNames.length]}` : undefined,
          rent: [7500, 7000, 7600][propertyIndex],
        }
      }),
    }))
  })
}

export function roomSummary(rooms: Room[]) {
  const beds = rooms.flatMap(room => room.beds)
  const count = (status: BedStatus) => beds.filter(bed => bed.status === status).length
  return {
    rooms: rooms.length, beds: beds.length,
    occupied: count('occupied'), vacant: count('vacant'), reserved: count('reserved'), maintenance: count('maintenance'),
    occupancy: beds.length ? count('occupied') / beds.length * 100 : 0,
  }
}

export function sharingType(beds: number) {
  return beds === 1 ? 'Single occupancy' : beds === 2 ? 'Double sharing' : beds === 3 ? 'Triple sharing' : `${beds}-sharing`
}

export function roomStatus(room: Room) {
  const stats = roomSummary([room])
  if (stats.occupied === stats.beds) return 'Fully occupied'
  if (stats.maintenance === stats.beds) return 'Under maintenance'
  if (stats.vacant === stats.beds) return 'Available'
  if (stats.reserved === stats.beds) return 'Reserved'
  return 'Mixed occupancy'
}
