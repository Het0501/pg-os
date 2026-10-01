export type Property = {
  id: string
  name: string
  location: string
  address: string
  description: string
  floors: number
  roomCount: number
  occupiedBeds: number
  revenue: number
  expenses: number
  amenities: string[]
}

export const properties: Property[] = [
  {
    id: 'sunrise-pg', name: 'Sunrise PG', location: 'Koramangala',
    address: '24, 5th Cross Road, Koramangala 5th Block, Bengaluru',
    description: 'A well-connected residence in the heart of Koramangala, with bright shared rooms and comfortable common spaces.',
    floors: 3, roomCount: 36, occupiedBeds: 100, revenue: 750000, expenses: 260000,
    amenities: ['Wi-Fi', 'Meals included', 'Laundry', 'Power backup'],
  },
  {
    id: 'green-nest', name: 'Green Nest', location: 'BTM',
    address: '18, 7th Main Road, BTM Layout 2nd Stage, Bengaluru',
    description: 'A quiet, welcoming home in BTM Layout, close to everyday essentials and major employment hubs.',
    floors: 3, roomCount: 24, occupiedBeds: 68, revenue: 476000, expenses: 165000,
    amenities: ['Wi-Fi', 'Meals included', 'Housekeeping', 'CCTV'],
  },
  {
    id: 'royal-stay', name: 'Royal Stay', location: 'HSR',
    address: '42, 19th Main Road, HSR Layout Sector 2, Bengaluru',
    description: 'A spacious residence in HSR Layout with thoughtfully furnished rooms and convenient access to the tech corridor.',
    floors: 2, roomCount: 22, occupiedBeds: 60, revenue: 454000, expenses: 165000,
    amenities: ['Wi-Fi', 'Meals included', 'Parking', 'Power backup'],
  },
]

export function propertyStats(property: Property) {
  const beds = property.roomCount * 3
  return { beds, vacant: beds - property.occupiedBeds, occupancy: property.occupiedBeds / beds * 100 }
}

export function propertyRooms(property: Property) {
  const roomsPerFloor = property.roomCount / property.floors
  const vacancies = propertyStats(property).vacant
  return Array.from({ length: property.roomCount }, (_, index) => {
    const floor = Math.floor(index / roomsPerFloor) + 1
    return {
      number: `${floor}${String(index % roomsPerFloor + 1).padStart(2, '0')}`,
      floor,
      beds: 3,
      occupied: index >= property.roomCount - vacancies ? 2 : 3,
    }
  })
}

export function rupees(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}
