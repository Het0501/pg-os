'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldError } from '@/components/ui/field'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { IntakeInput, IntakeSelect } from './intake-fields'
import { properties, rupees } from '@/lib/properties'
import { usePrototype } from '@/lib/prototype-store'
import { demoDate } from '@/lib/vacancies'

export function AssignmentSheet({ kind, id, name, initialProperty = '', initialMoveIn = '', onClose, onDone }: { kind: 'lead' | 'onboarding'; id: string; name: string; initialProperty?: string; initialMoveIn?: string; onClose: () => void; onDone: () => void }) {
  const { rooms, tenants, admit } = usePrototype()
  const [propertyId, setPropertyId] = useState(initialProperty)
  const [roomId, setRoomId] = useState('')
  const [bedId, setBedId] = useState('')
  const [moveIn, setMoveIn] = useState(initialMoveIn || demoDate)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const available = (bed: { id: string; status: string }) => bed.status === 'vacant' && !tenants.some(tenant => tenant.bedId === bed.id)
  const availableRooms = rooms.filter(room => room.propertyId === propertyId && room.beds.some(available))
  const beds = availableRooms.find(room => room.id === roomId)?.beds.filter(available) ?? []
  const selected = beds.find(bed => bed.id === bedId)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await admit(kind, id, { propertyId, roomId, bedId, moveIn }); onDone() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to assign bed. Please try again.'); setBusy(false) }
  }
  return <Sheet open onOpenChange={open => { if (!open && !busy) onClose() }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg"><SheetHeader className="p-6 pr-12"><SheetTitle>{kind === 'lead' ? 'Convert lead' : 'Approve & assign bed'}</SheetTitle><SheetDescription>{name} · Only vacant, unassigned beds are available.</SheetDescription></SheetHeader><form onSubmit={submit} className="flex flex-col gap-6 p-6 pt-0"><FieldGroup>
    <IntakeSelect label="Assign property" value={propertyId} required onChange={event => { setPropertyId(event.target.value); setRoomId(''); setBedId('') }} options={[{ value: '', label: 'Select property' }, ...properties.map(p => ({ value: p.id, label: p.name }))]} />
    <IntakeSelect label="Assign room" value={roomId} required disabled={!propertyId} onChange={event => { setRoomId(event.target.value); setBedId('') }} options={[{ value: '', label: 'Select room' }, ...availableRooms.map(room => ({ value: room.id, label: `Room ${room.number} · ${room.beds.filter(available).length} vacant` }))]} />
    <IntakeSelect label="Assign bed" value={bedId} required disabled={!roomId} onChange={event => setBedId(event.target.value)} options={[{ value: '', label: 'Select bed' }, ...beds.map(bed => ({ value: bed.id, label: `Bed ${bed.label} · ${rupees(bed.rent)}/month` }))]} />
    <IntakeInput label="Move-in date" type="date" value={moveIn} onChange={event => setMoveIn(event.target.value)} required />
  </FieldGroup>{propertyId && !availableRooms.length && <p role="status" className="text-sm text-muted-foreground">No vacant beds at this property. Select another property.</p>}{selected && <p className="text-sm text-muted-foreground">Monthly rent: {rupees(selected.rent)} · Deposit: {rupees(selected.rent * 2)}. Rent starts as pending in this demo.</p>}{error && <FieldError role="alert">{error}</FieldError>}<Button type="submit" disabled={busy || !selected}>{busy ? 'Assigning…' : 'Confirm & create tenant'}</Button><Button variant="outline" type="button" disabled={busy} onClick={onClose}>Cancel</Button></form></SheetContent></Sheet>
}
