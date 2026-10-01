'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BedDouble, Building2, Info, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'
import { BedStatusLabel, RoomCard } from '@/components/rooms/room-card'
import { RoomDetails } from '@/components/rooms/room-details'
import { RoomForm, type RoomFormMode } from '@/components/rooms/room-form'
import { properties } from '@/lib/properties'
import { bedStatuses, roomSummary, type Bed, type Room } from '@/lib/rooms'
import { usePrototype } from '@/lib/prototype-store'

export function RoomsManagement({ initialRoomId, initialBedId, initialPropertyId }: { initialRoomId?: string; initialBedId?: string; initialPropertyId?: string }) {
  const { rooms, update } = usePrototype()
  const router = useRouter()
  function closeDetails() {
    setDetailsId(null)
    if (initialRoomId) router.replace(`/rooms?property=${encodeURIComponent(propertyId)}`, { scroll: false })
  }
  const setRooms = (transform: (current: Room[]) => Room[]) => update(state => ({ ...state, rooms: transform(state.rooms) }))
  const [propertyId, setPropertyId] = useState(rooms.find(room => room.id === initialRoomId)?.propertyId ?? properties.find(property => property.id === initialPropertyId)?.id ?? properties[0].id)
  const [floor, setFloor] = useState('all')
  const [detailsId, setDetailsId] = useState<string | null>(initialRoomId ?? null)
  const [form, setForm] = useState<RoomFormMode | null>(null)
  const [notice, setNotice] = useState('')
  const property = properties.find(item => item.id === propertyId)!
  const propertyLabel = `${property.name} — ${property.location}`
  const propertyRooms = rooms.filter(room => room.propertyId === propertyId)
  const stats = roomSummary(propertyRooms)
  const floors = [...new Set(propertyRooms.map(room => room.floor))].sort((a, b) => a - b)
  const visibleFloors = floor === 'all' ? floors : floors.filter(value => String(value) === floor)
  const availableRoom = propertyRooms.find(room => room.beds.length < 6)
  const metrics = [
    ['Total Rooms', stats.rooms], ['Total Beds', stats.beds], ['Occupied Beds', stats.occupied],
    ['Vacant Beds', stats.vacant], ['Reserved Beds', stats.reserved], ['Maintenance Beds', stats.maintenance], ['Occupancy', `${stats.occupancy.toFixed(1)}%`],
  ] as const

  function addRoom(room: Room) {
    setRooms(current => [...current, room])
    setFloor(String(room.floor))
    setNotice(`Room ${room.number} added with ${room.beds.length} vacant beds. Mock preview only.`)
  }

  function addBed(roomId: string, bed: Bed) {
    setRooms(current => current.map(room => room.id === roomId ? { ...room, beds: [...room.beds, bed] } : room))
    const room = propertyRooms.find(item => item.id === roomId)!
    setFloor(String(room.floor))
    setNotice(`Bed ${bed.label} added to Room ${room.number}. Mock preview only.`)
  }

  return (
    <div className="dashboard-enter flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div><p className="section-eyebrow mb-3">Every room, every bed</p><h1 className="text-[30px] leading-tight font-medium tracking-[-0.045em]">Rooms & Beds</h1><p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">A clear view of who&apos;s settled in and what&apos;s available.</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={!availableRoom} onClick={() => availableRoom && setForm({ kind: 'bed', roomId: availableRoom.id })}><BedDouble data-icon="inline-start" />Add Bed</Button><Button onClick={() => setForm({ kind: 'room' })}><Plus data-icon="inline-start" />Add Room</Button></div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex w-full flex-col gap-2 sm:w-80"><Label htmlFor="rooms-property">Property</Label><NativeSelect id="rooms-property" className="w-full" value={propertyId} onChange={event => { setPropertyId(event.target.value); setFloor('all'); setNotice(''); setDetailsId(null); setForm(null) }}>{properties.map(item => <NativeSelectOption key={item.id} value={item.id}>{item.name} — {item.location}</NativeSelectOption>)}</NativeSelect></div>
        <p className="text-[11px] text-muted-foreground">{property.name} · {floors.length} floors · Sample data</p>
      </div>
      <section aria-label={`${property.name} room and bed summary`} className="grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-7">
        {metrics.map(([label, value]) => <Card key={label} className="stat-card" data-highlight={label === 'Occupancy'}><CardHeader><CardTitle><span className="text-[11px] font-normal text-muted-foreground">{label}</span></CardTitle></CardHeader><CardContent><p className="metric-value">{value}</p></CardContent></Card>)}
      </section>
      <div role="status" aria-live="polite" className={notice ? 'rounded-lg border border-primary/20 bg-accent p-3 text-xs text-primary' : 'sr-only'}>{notice}</div>
      <section aria-labelledby="all-rooms-heading" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5"><h2 id="all-rooms-heading" className="text-sm font-medium">{property.name} rooms</h2><Badge variant="secondary">{stats.rooms}</Badge></div>
          <div className="flex items-center gap-2"><Label htmlFor="rooms-floor">Floor</Label><NativeSelect id="rooms-floor" value={floor} onChange={event => setFloor(event.target.value)}><NativeSelectOption value="all">All floors</NativeSelectOption>{floors.map(value => <NativeSelectOption key={value} value={value}>{value === 0 ? 'Ground floor' : `Floor ${value}`}</NativeSelectOption>)}</NativeSelect></div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Bed status legend">{bedStatuses.map(status => <BedStatusLabel key={status} status={status} />)}</div>
        {visibleFloors.map(value => (
          <section key={value} aria-label={`Floor ${value}`} className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-xs text-muted-foreground"><Building2 className="size-4" aria-hidden="true" />{value === 0 ? 'Ground floor' : `Floor ${value}`}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{propertyRooms.filter(room => room.floor === value).map(room => <RoomCard key={room.id} room={room} onDetails={() => setDetailsId(room.id)} onAddBed={() => setForm({ kind: 'bed', roomId: room.id })} />)}</div>
          </section>
        ))}
      </section>
      <footer className="flex items-start gap-1.5 border-t border-border pt-4 text-[10px] leading-relaxed text-muted-foreground"><Info className="mt-0.5 size-3 shrink-0" />Prototype workspace · Sample room and bed data. Changes are shared across this demo and reset on reload.</footer>
      <RoomDetails room={propertyRooms.find(room => room.id === detailsId) ?? null} selectedBedId={detailsId === initialRoomId ? initialBedId : undefined} propertyName={propertyLabel} onClose={closeDetails} />
      {form && <RoomForm mode={form} rooms={propertyRooms} propertyId={propertyId} propertyName={propertyLabel} defaultRent={propertyRooms[0]?.beds[0]?.rent ?? 7500} onClose={() => setForm(null)} onAddRoom={addRoom} onAddBed={addBed} />}
    </div>
  )
}
