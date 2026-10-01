'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldError } from '@/components/ui/field'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { IntakeInput, IntakeSelect, choices } from './intake-fields'
import { properties } from '@/lib/properties'
import { leadSources, leadStages, validPhone, createdToday, type Lead } from '@/lib/leads'
import { usePrototype } from '@/lib/prototype-store'

export function LeadForm({ lead, propertyId, website = false, onClose, onSaved }: { lead?: Lead; propertyId?: string; website?: boolean; onClose: () => void; onSaved: () => void }) {
  const { update } = usePrototype()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    if (!text('name') || !validPhone(text('phone'))) return setError('Enter a name and a valid phone number with 10–15 digits.')
    const budget = Number(text('budget'))
    if (!Number.isInteger(budget) || budget < 0 || budget > 100000) return setError('Budget must be between ₹0 and ₹1,00,000 in whole rupees.')
    const saved: Lead = { id: lead?.id ?? crypto.randomUUID(), name: text('name'), phone: text('phone'), email: text('email'), propertyId: propertyId ?? text('propertyId'), sharing: text('sharing'), moveIn: text('moveIn'), budget, notes: text('notes'), source: website ? 'Website' : text('source') as Lead['source'], stage: website ? 'NEW' : text('stage') as Lead['stage'], created: lead?.created ?? createdToday() }
    setBusy(true)
    await update(state => ({ ...state, leads: lead ? state.leads.map(item => item.id === lead.id && !item.tenantId ? saved : item) : [saved, ...state.leads] }))
    onSaved()
  }
  return <Sheet open onOpenChange={open => { if (!open) onClose() }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl"><SheetHeader className="p-6 pr-12"><SheetTitle>{website ? 'Enquire Now' : lead ? 'Edit lead' : 'Add lead'}</SheetTitle><SheetDescription>Use sample details only. This enquiry stays in the shared demo until reload.</SheetDescription></SheetHeader><form className="flex flex-col gap-6 p-6 pt-0" onSubmit={submit}><FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <IntakeInput label="Full name" name="name" required defaultValue={lead?.name} />
    <IntakeInput label="Phone" name="phone" type="tel" required defaultValue={lead?.phone} />
    <IntakeInput label="Email" name="email" type="email" required defaultValue={lead?.email} />
    {!website && <IntakeSelect label="Source" name="source" defaultValue={lead?.source ?? 'Walk-in'} options={choices(leadSources)} />}
    {!propertyId && <IntakeSelect label="Interested property" name="propertyId" required defaultValue={lead?.propertyId ?? ''} options={[{ value: '', label: 'Select property' }, ...properties.map(p => ({ value: p.id, label: p.name }))]} />}
    <IntakeSelect label="Preferred sharing" name="sharing" defaultValue={lead?.sharing ?? 'Triple sharing'} options={choices(['Single occupancy', 'Double sharing', 'Triple sharing', 'No preference'])} />
    <IntakeInput label="Expected move-in" name="moveIn" type="date" required defaultValue={lead?.moveIn} />
    <IntakeInput label="Budget / month (₹)" name="budget" type="number" min={0} max={100000} step={1} required defaultValue={lead?.budget ?? 7500} />
    {!website && <IntakeSelect label="Stage" name="stage" defaultValue={lead?.stage ?? 'NEW'} options={choices(leadStages.filter(stage => stage !== 'CONVERTED'))} />}
    <IntakeInput label="Notes" name="notes" maxLength={1000} defaultValue={lead?.notes} />
  </FieldGroup>{error && <FieldError role="alert">{error}</FieldError>}<Button type="submit" disabled={busy}>{website ? 'Submit enquiry' : 'Save lead'}</Button><Button variant="outline" type="button" onClick={onClose}>Cancel</Button></form></SheetContent></Sheet>
}
