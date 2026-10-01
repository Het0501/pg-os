'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { sharingType, type Bed, type BedStatus, type Room } from '@/lib/rooms'

export type RoomFormMode = { kind: 'room' } | { kind: 'bed'; roomId: string }

type Props = {
  mode: RoomFormMode
  rooms: Room[]
  propertyId: string
  propertyName: string
  defaultRent: number
  onClose: () => void
  onAddRoom: (room: Room) => void
  onAddBed: (roomId: string, bed: Bed) => void
}

export function RoomForm({ mode, rooms, propertyId, propertyName, defaultRent, onClose, onAddRoom, onAddBed }: Props) {
  const [roomId, setRoomId] = useState(mode.kind === 'bed' ? mode.roomId : '')
  const [number, setNumber] = useState('')
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')
  const selectedRoom = rooms.find(room => room.id === roomId)
  const addingRoom = mode.kind === 'room'
  const suggestedLabel = selectedRoom ? 'ABCDEF'.split('').find(letter => !selectedRoom.beds.some(bed => bed.label.toUpperCase() === letter)) ?? '' : ''

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const rent = Number(data.get('rent'))
    if (!Number.isFinite(rent) || rent <= 0 || rent > 100000 || !Number.isInteger(rent)) {
      setError('Enter a monthly rent between ₹1 and ₹1,00,000 in whole rupees.')
      return
    }
    if (addingRoom) {
      const trimmedNumber = number.trim()
      if (!trimmedNumber || rooms.some(room => room.number.toLowerCase() === trimmedNumber.toLowerCase())) {
        setError('Enter a unique room number for this property.')
        return
      }
      const count = Number(data.get('beds'))
      const floor = Number(data.get('floor'))
      if (!Number.isInteger(count) || count < 1 || count > 6 || !Number.isInteger(floor) || floor < 0 || floor > 99) {
        setError('Choose 1–6 beds and a floor between 0 and 99.')
        return
      }
      const id = crypto.randomUUID()
      onAddRoom({
        id, propertyId, number: trimmedNumber, floor,
        beds: Array.from({ length: count }, (_, index) => ({ id: `${id}-${index}`, label: String.fromCharCode(65 + index), status: 'vacant', rent })),
      })
    } else {
      const bedLabel = (label || suggestedLabel).trim().toUpperCase()
      if (!selectedRoom || selectedRoom.beds.length >= 6) {
        setError('Select a room with fewer than 6 beds.')
        return
      }
      if (!bedLabel || selectedRoom.beds.some(bed => bed.label.toUpperCase() === bedLabel)) {
        setError('Enter a unique bed identifier for this room.')
        return
      }
      const status = String(data.get('status')) as BedStatus
      if (!['vacant', 'reserved', 'maintenance'].includes(status)) return
      onAddBed(selectedRoom.id, { id: crypto.randomUUID(), label: bedLabel, status, rent })
    }
    onClose()
  }

  return (
    <Sheet open onOpenChange={open => { if (!open) onClose() }}>
      <SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="p-6 pr-12"><SheetTitle>{addingRoom ? 'Add Room' : 'Add Bed'}</SheetTitle><SheetDescription>{propertyName} · Mock changes only</SheetDescription></SheetHeader>
        <form onSubmit={submit} className="flex flex-1 flex-col gap-6" onChange={() => setError('')}>
          <FieldGroup className="px-6">
            {addingRoom ? <>
              <Field data-invalid={!!error}><FieldLabel htmlFor="room-number">Room number</FieldLabel><Input id="room-number" name="number" value={number} onChange={event => setNumber(event.target.value)} placeholder="e.g. 401" maxLength={12} required aria-invalid={!!error} aria-describedby={error ? 'room-form-error' : undefined} /></Field>
              <Field><FieldLabel htmlFor="room-floor">Floor</FieldLabel><Input id="room-floor" name="floor" type="number" min={0} max={99} step={1} defaultValue={1} required /></Field>
              <Field><FieldLabel htmlFor="room-beds">Sharing type / beds</FieldLabel><NativeSelect id="room-beds" name="beds" defaultValue="3">{[1, 2, 3, 4, 5, 6].map(count => <NativeSelectOption key={count} value={count}>{sharingType(count)} · {count} {count === 1 ? 'bed' : 'beds'}</NativeSelectOption>)}</NativeSelect><FieldDescription>All beds in a new room start as vacant.</FieldDescription></Field>
            </> : <>
              <Field><FieldLabel htmlFor="bed-room">Room</FieldLabel><NativeSelect id="bed-room" value={roomId} onChange={event => { setRoomId(event.target.value); setLabel('') }} required>{rooms.map(room => <NativeSelectOption key={room.id} value={room.id} disabled={room.beds.length >= 6}>Room {room.number} · {room.beds.length} beds{room.beds.length >= 6 ? ' (limit reached)' : ''}</NativeSelectOption>)}</NativeSelect></Field>
              <Field data-invalid={!!error}><FieldLabel htmlFor="bed-label">Bed identifier</FieldLabel><Input id="bed-label" value={label || suggestedLabel} onChange={event => setLabel(event.target.value)} placeholder="e.g. D" maxLength={12} required aria-invalid={!!error} aria-describedby={error ? 'room-form-error' : undefined} /><FieldDescription>Up to 6 beds per room in this prototype. Sharing type updates automatically.</FieldDescription></Field>
              <Field><FieldLabel htmlFor="bed-status">Status</FieldLabel><NativeSelect id="bed-status" name="status" defaultValue="vacant"><NativeSelectOption value="vacant">Vacant</NativeSelectOption><NativeSelectOption value="reserved">Reserved</NativeSelectOption><NativeSelectOption value="maintenance">Maintenance</NativeSelectOption></NativeSelect><FieldDescription>Occupied beds are provided as sample data; tenant assignment is not part of this step.</FieldDescription></Field>
            </>}
            <Field><FieldLabel htmlFor="monthly-rent">Monthly rent per bed (₹)</FieldLabel><Input id="monthly-rent" name="rent" type="number" min={1} max={100000} step={1} defaultValue={defaultRent} required /></Field>
            {error && <FieldError id="room-form-error" role="alert">{error}</FieldError>}
            <p className="text-[11px] leading-relaxed text-muted-foreground">Changes only appear in this Rooms & Beds preview. They reset when you reload or leave this page and do not change the property overview.</p>
          </FieldGroup>
          <SheetFooter className="p-6"><Button type="submit">{addingRoom ? 'Create room' : 'Create bed'}</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
