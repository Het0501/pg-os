'use client'

import { useState, type ComponentProps, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { properties } from '@/lib/properties'
import { idTypes, type Tenant } from '@/lib/tenants'
import type { Room } from '@/lib/rooms'

function TextField({ label, name, ...props }: ComponentProps<typeof Input> & { label: string; name: string }) {
  return <Field data-invalid={props['aria-invalid']}><FieldLabel htmlFor={`tenant-${name}`}>{label}</FieldLabel><Input id={`tenant-${name}`} name={name} maxLength={100} {...props} /></Field>
}

export function TenantForm({ tenants, rooms, onClose, onAdd }: { tenants: Tenant[]; rooms: Room[]; onClose: () => void; onAdd: (tenant: Tenant) => void }) {
  const [propertyId, setPropertyId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [bedId, setBedId] = useState('')
  const [rent, setRent] = useState('')
  const [error, setError] = useState<{ field: string; message: string } | null>(null)
  const [moveIn, setMoveIn] = useState('')
  const [kyc, setKyc] = useState<'Pending' | 'Complete'>('Pending')
  const available = (room: Room) => room.beds.filter(bed => bed.status === 'vacant' && !tenants.some(tenant => tenant.bedId === bed.id))
  const propertyRooms = rooms.filter(room => room.propertyId === propertyId)
  const selectedRoom = propertyRooms.find(room => room.id === roomId)
  const beds = selectedRoom ? available(selectedRoom) : []
  const invalid = (name: string) => ({ 'aria-invalid': error?.field === name, 'aria-describedby': error?.field === name ? 'tenant-form-error' : undefined })

  function fail(field: string, message: string) {
    setError({ field, message })
    requestAnimationFrame(() => document.getElementById(`tenant-${field}`)?.focus())
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    for (const field of ['name', 'phone', 'email', 'dob', 'emergencyName', 'relationship', 'emergencyPhone']) {
      if (!text(field)) return fail(field, 'Please complete all required personal and emergency contact details.')
    }
    for (const field of ['phone', 'emergencyPhone']) {
      const digits = text(field).replace(/\D/g, '')
      if (!/^[+\d\s()-]+$/.test(text(field)) || digits.length < 10 || digits.length > 15) return fail(field, 'Enter a valid phone number with 10–15 digits.')
    }
    if (!selectedRoom || !beds.some(bed => bed.id === bedId)) return fail('bed', 'Choose an available bed in the selected property and room.')
    const monthlyRent = Number(rent)
    const deposit = Number(text('deposit'))
    if (!Number.isInteger(monthlyRent) || monthlyRent <= 0 || monthlyRent > 100000) return fail('rent', 'Monthly rent must be ₹1–₹1,00,000 in whole rupees.')
    if (!Number.isInteger(deposit) || deposit < 0 || deposit > 1000000) return fail('deposit', 'Security deposit must be ₹0–₹10,00,000 in whole rupees.')
    if (!moveIn || text('dob') >= moveIn || text('dob') >= new Date().toISOString().slice(0, 10)) return fail('dob', 'Date of birth must be before today and the move-in date.')
    if (text('moveOut') && text('moveOut') < moveIn) return fail('moveOut', 'Expected move-out must be on or after the move-in date.')
    if (kyc === 'Complete' && !text('idNumber')) return fail('idNumber', 'Enter a sample ID number to mark KYC complete.')
    onAdd({
      id: crypto.randomUUID(), name: text('name'), phone: text('phone'), email: text('email'), dob: text('dob'),
      propertyId, roomId, bedId, rent: monthlyRent, deposit, dueDay: Number(text('dueDay')), moveIn, moveOut: text('moveOut'),
      payment: 'Pending', kyc, idType: text('idType'), idLastFour: text('idNumber').slice(-4),
      emergencyName: text('emergencyName'), relationship: text('relationship'), emergencyPhone: text('emergencyPhone'),
      outstanding: monthlyRent, lastPayment: null,
    })
    onClose()
  }

  return <Sheet open onOpenChange={open => { if (!open) onClose() }}>
    <SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
      <SheetHeader className="p-6 pr-12"><SheetTitle>Add Tenant</SheetTitle><SheetDescription>A new home, a new resident. Use sample details only.</SheetDescription></SheetHeader>
      <form className="flex flex-1 flex-col gap-6" onSubmit={submit} onChange={() => setError(null)}>
        <FieldGroup className="px-6">
          {error && <FieldError id="tenant-form-error" role="alert">{error.message}</FieldError>}
          <FieldSet><FieldLegend>Personal details</FieldLegend><FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Full name" name="name" placeholder="e.g. Vivek Kumar" required {...invalid('name')} />
            <TextField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" required {...invalid('phone')} />
            <TextField label="Email" name="email" type="email" placeholder="name@example.com" required {...invalid('email')} />
            <TextField label="Date of birth" name="dob" type="date" required {...invalid('dob')} />
          </FieldGroup></FieldSet>
          <FieldSet><FieldLegend>Stay details</FieldLegend><FieldDescription>Only vacant, unassigned beds can be selected.</FieldDescription><FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field><FieldLabel htmlFor="tenant-property">Property</FieldLabel><NativeSelect id="tenant-property" className="w-full" value={propertyId} required onChange={event => { setPropertyId(event.target.value); setRoomId(''); setBedId(''); setRent('') }}><NativeSelectOption value="">Select property</NativeSelectOption>{properties.map(property => <NativeSelectOption key={property.id} value={property.id}>{property.name}</NativeSelectOption>)}</NativeSelect></Field>
            <Field data-disabled={!propertyId}><FieldLabel htmlFor="tenant-room">Room</FieldLabel><NativeSelect id="tenant-room" className="w-full" value={roomId} disabled={!propertyId} required onChange={event => { setRoomId(event.target.value); setBedId(''); setRent('') }}><NativeSelectOption value="">Select room</NativeSelectOption>{propertyRooms.map(room => <NativeSelectOption key={room.id} value={room.id} disabled={!available(room).length}>Room {room.number} · {available(room).length} available</NativeSelectOption>)}</NativeSelect></Field>
            <Field data-disabled={!roomId} data-invalid={error?.field === 'bed'}><FieldLabel htmlFor="tenant-bed">Bed</FieldLabel><NativeSelect id="tenant-bed" className="w-full" value={bedId} disabled={!roomId} required {...invalid('bed')} onChange={event => { setBedId(event.target.value); setRent(String(beds.find(bed => bed.id === event.target.value)?.rent ?? '')) }}><NativeSelectOption value="">Select bed</NativeSelectOption>{beds.map(bed => <NativeSelectOption key={bed.id} value={bed.id}>Bed {bed.label} · Vacant</NativeSelectOption>)}</NativeSelect></Field>
            <TextField label="Monthly rent (₹)" name="rent" type="number" min={1} max={100000} step={1} value={rent} onChange={event => setRent(event.target.value)} required {...invalid('rent')} />
            <TextField label="Security deposit (₹)" name="deposit" type="number" min={0} max={1000000} step={1} placeholder="15000" required {...invalid('deposit')} />
            <Field><FieldLabel htmlFor="tenant-dueDay">Due date</FieldLabel><NativeSelect id="tenant-dueDay" className="w-full" name="dueDay" defaultValue="5">{Array.from({ length: 28 }, (_, i) => <NativeSelectOption key={i} value={i + 1}>Day {i + 1} of each month</NativeSelectOption>)}</NativeSelect></Field>
            <TextField label="Move-in date" name="moveIn" type="date" value={moveIn} onChange={event => setMoveIn(event.target.value)} required />
            <TextField label="Expected move-out (optional)" name="moveOut" type="date" min={moveIn || undefined} {...invalid('moveOut')} />
          </FieldGroup>{propertyId && !propertyRooms.some(room => available(room).length) && <FieldDescription>No vacant beds remain in this property. Choose another property.</FieldDescription>}</FieldSet>
          <FieldSet><FieldLegend>Emergency contact</FieldLegend><FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Contact name" name="emergencyName" required {...invalid('emergencyName')} />
            <TextField label="Relationship" name="relationship" placeholder="e.g. Father" required {...invalid('relationship')} />
            <TextField label="Contact phone" name="emergencyPhone" type="tel" required {...invalid('emergencyPhone')} />
          </FieldGroup></FieldSet>
          <FieldSet><FieldLegend>KYC details</FieldLegend><FieldDescription>Simulated status only. Do not enter real identity numbers. Only the last four characters are kept in this preview.</FieldDescription><FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field><FieldLabel htmlFor="tenant-idType">ID type</FieldLabel><NativeSelect id="tenant-idType" className="w-full" name="idType" defaultValue="Aadhaar">{idTypes.map(type => <NativeSelectOption key={type}>{type}</NativeSelectOption>)}</NativeSelect></Field>
            <TextField label="Sample ID number" name="idNumber" maxLength={24} placeholder="Demo number only" required={kyc === 'Complete'} {...invalid('idNumber')} />
            <Field><FieldLabel htmlFor="tenant-kyc">ID / KYC status</FieldLabel><NativeSelect id="tenant-kyc" className="w-full" value={kyc} onChange={event => setKyc(event.target.value as 'Pending' | 'Complete')}><NativeSelectOption>Pending</NativeSelectOption><NativeSelectOption>Complete</NativeSelectOption></NativeSelect></Field>
          </FieldGroup></FieldSet>
          <p className="text-[11px] leading-relaxed text-muted-foreground">Prototype only. New tenants and bed assignments are shared across this demo and reset on reload. No database or verification service is connected.</p>
        </FieldGroup>
        <SheetFooter className="p-6"><Button type="submit">Create tenant</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
}
