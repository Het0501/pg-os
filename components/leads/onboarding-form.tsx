'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet, FieldLegend, FieldDescription, FieldError } from '@/components/ui/field'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { IntakeInput, IntakeSelect, choices } from './intake-fields'
import { validPhone, duplicateResident, createdToday, type Onboarding } from '@/lib/leads'
import { usePrototype } from '@/lib/prototype-store'

export function OnboardingForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { update } = usePrototype()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    if (!text('name') || !validPhone(text('phone')) || !validPhone(text('emergencyPhone'))) return setError('Enter a name and valid phone numbers with 10–15 digits.')
    if (text('dob') >= new Date().toISOString().slice(0, 10)) return setError('Date of birth must be before today.')
    if (!/^\d{6}$/.test(text('pincode'))) return setError('Pincode must contain six digits.')
    const application: Onboarding = { id: crypto.randomUUID(), name: text('name'), phone: text('phone'), email: text('email'), dob: text('dob'), gender: text('gender'), address: text('address'), city: text('city'), state: text('state'), pincode: text('pincode'), emergencyName: text('emergencyName'), relationship: text('relationship'), emergencyPhone: text('emergencyPhone'), occupation: text('occupation'), organization: text('organization'), designation: text('designation'), idType: text('idType'), idLastFour: text('idNumber').slice(-4), kyc: 'Pending', photo: text('photo'), document: text('document'), otherDocument: text('otherDocument'), status: 'Pending approval', created: createdToday() }
    setBusy(true)
    try {
      await update(state => {
        if (duplicateResident(state, application) || state.onboarding.some(item => item.email.toLowerCase() === application.email.toLowerCase() || item.phone.replace(/\D/g, '') === application.phone.replace(/\D/g, ''))) throw new Error('This person already has an application or a tenant record. Review that record instead.')
        return { ...state, onboarding: [application, ...state.onboarding] }
      })
      onSaved()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to submit.'); setBusy(false) }
  }
  return <Sheet open onOpenChange={open => { if (!open) onClose() }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-2xl"><SheetHeader className="p-6 pr-12"><SheetTitle>Tenant onboarding</SheetTitle><SheetDescription>Submit sample details for owner review. No identity verification or document upload takes place.</SheetDescription></SheetHeader><form onSubmit={submit} className="flex flex-col gap-6 p-6 pt-0"><FieldGroup>
    <FieldSet><FieldLegend>Personal details</FieldLegend><FieldGroup className="grid gap-4 sm:grid-cols-2"><IntakeInput label="Full name" name="name" required /><IntakeInput label="Phone" name="phone" type="tel" required /><IntakeInput label="Email" name="email" type="email" required /><IntakeInput label="Date of birth" name="dob" type="date" required /><IntakeSelect label="Gender" name="gender" options={choices(['Prefer not to say', 'Female', 'Male', 'Other'])} /></FieldGroup></FieldSet>
    <FieldSet><FieldLegend>Address</FieldLegend><FieldGroup className="grid gap-4 sm:grid-cols-2"><IntakeInput label="Current address" name="address" required /><IntakeInput label="City" name="city" required /><IntakeInput label="State" name="state" required /><IntakeInput label="Pincode" name="pincode" inputMode="numeric" maxLength={6} required /></FieldGroup></FieldSet>
    <FieldSet><FieldLegend>Emergency contact</FieldLegend><FieldGroup className="grid gap-4 sm:grid-cols-2"><IntakeInput label="Contact name" name="emergencyName" required /><IntakeInput label="Relationship" name="relationship" required /><IntakeInput label="Contact phone" name="emergencyPhone" type="tel" required /></FieldGroup></FieldSet>
    <FieldSet><FieldLegend>Occupation</FieldLegend><FieldGroup className="grid gap-4 sm:grid-cols-2"><IntakeSelect label="Occupation type" name="occupation" options={choices(['Student', 'Working', 'Other'])} /><IntakeInput label="College / company" name="organization" /><IntakeInput label="Course / designation" name="designation" /></FieldGroup></FieldSet>
    <FieldSet><FieldLegend>Identification</FieldLegend><FieldDescription>Sample numbers only. Only the last four characters are retained. KYC starts as Pending.</FieldDescription><FieldGroup className="grid gap-4 sm:grid-cols-2"><IntakeSelect label="ID type" name="idType" options={choices(['PAN', 'Passport', 'Driving licence', 'Other'])} /><IntakeInput label="Sample ID number" name="idNumber" placeholder="DEMO1234" maxLength={24} required /></FieldGroup></FieldSet>
    <FieldSet><FieldLegend>Document placeholders</FieldLegend><FieldDescription>Simulated attachments only. No files are selected, uploaded or stored.</FieldDescription><FieldGroup className="grid gap-4 sm:grid-cols-2">{[{ name: 'photo', label: 'Profile photo' }, { name: 'document', label: 'ID document' }, { name: 'otherDocument', label: 'Other document' }].map(item => <IntakeSelect key={item.name} label={item.label} name={item.name} options={choices(['Not provided', 'Sample attached'])} />)}</FieldGroup></FieldSet>
  </FieldGroup>{error && <FieldError role="alert">{error}</FieldError>}<Button type="submit" disabled={busy}>Submit for approval</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></form></SheetContent></Sheet>
}
