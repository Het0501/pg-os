import type { Room } from '@/lib/rooms'
export const demoDate = '2026-09-21'
export function vacancies(rooms: Room[], asOf = demoDate) {
  return rooms.flatMap(room => room.beds.filter(bed => bed.status === 'vacant').map(bed => {
    const since = bed.vacantSince ?? '2026-09-10'
    const days = Math.max(0, Math.floor((Date.parse(asOf) - Date.parse(since)) / 86400000))
    return { room, bed, since, days, daily: bed.rent / 30, lost: bed.rent / 30 * days }
  }))
}
