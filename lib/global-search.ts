import { properties } from '@/lib/properties'
import { statusLabels, type Room } from '@/lib/rooms'
import type { Tenant } from '@/lib/tenants'

export type SearchResult = { id: string; title: string; description: string; href: string; keywords: string }
export type SearchGroup = { type: 'Tenants' | 'Properties' | 'Rooms' | 'Beds'; results: SearchResult[]; total: number }

export function searchWorkspace(query: string, tenants: Tenant[], rooms: Room[]): SearchGroup[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  const roomById = new Map(rooms.map(room => [room.id, room]))
  const propertyById = new Map(properties.map(property => [property.id, property]))
  const tenantByBed = new Map(tenants.map(tenant => [tenant.bedId, tenant]))
  function group(type: SearchGroup['type'], entries: SearchResult[]): SearchGroup {
    const matches = entries.filter(entry => tokens.every(token => `${entry.title} ${entry.description} ${entry.keywords}`.toLowerCase().includes(token)))
    return { type, results: matches.slice(0, 8), total: matches.length }
  }
  const groups = [
    group('Tenants', tenants.map(tenant => {
      const room = roomById.get(tenant.roomId)
      const bed = room?.beds.find(bed => bed.id === tenant.bedId)
      const property = propertyById.get(tenant.propertyId)
      return { id: tenant.id, title: tenant.name, description: `${property?.name ?? 'Property'} · Room ${room?.number ?? '—'} · Bed ${bed?.label ?? '—'}`, href: `/tenants?tenant=${encodeURIComponent(tenant.id)}`, keywords: `${tenant.id} ${tenant.email} ${tenant.phone} ${tenant.phone.replace(/\D/g, '')} ${property?.location ?? ''}` }
    })),
    group('Properties', properties.map(property => ({ id: property.id, title: property.name, description: property.location, href: `/properties/${property.id}`, keywords: `${property.id} ${property.address}` }))),
    group('Rooms', rooms.map(room => ({ id: room.id, title: `Room ${room.number}`, description: `${propertyById.get(room.propertyId)?.name ?? 'Property'} · Floor ${room.floor} · ${room.beds.length} beds`, href: `/rooms?room=${encodeURIComponent(room.id)}`, keywords: `${room.id} ${propertyById.get(room.propertyId)?.location ?? ''}` }))),
    group('Beds', rooms.flatMap(room => room.beds.map(bed => ({ id: bed.id, title: `Bed ${bed.label} · Room ${room.number}`, description: `${propertyById.get(room.propertyId)?.name ?? 'Property'} · ${statusLabels[bed.status]}${tenantByBed.has(bed.id) ? ` · ${tenantByBed.get(bed.id)!.name}` : ''}`, href: `/rooms?room=${encodeURIComponent(room.id)}&bed=${encodeURIComponent(bed.id)}`, keywords: `${bed.id} ${room.number}${bed.label} ${propertyById.get(room.propertyId)?.location ?? ''}` })))),
  ]
  const score = (group: SearchGroup) => Math.max(0, ...group.results.map(result => result.title.toLowerCase() === query.trim().toLowerCase() ? 2 : tokens.every(token => result.title.toLowerCase().includes(token)) ? 1 : 0))
  return groups.sort((a, b) => score(b) - score(a))
}
