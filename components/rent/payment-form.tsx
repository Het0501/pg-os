'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { usePrototype } from '@/lib/prototype-store'
import { rupees } from '@/lib/properties'
import { demoToday, paymentMethods } from '@/lib/rent'
import type { Tenant } from '@/lib/tenants'

export function PaymentForm({ tenant, onClose, onSaved }: { tenant: Tenant; onClose: () => void; onSaved: () => void }) {
  const { recordPayment } = usePrototype()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const values = new FormData(event.currentTarget)
    const amount = Number(values.get('amount'))
    const date = String(values.get('date'))
    if (!Number.isInteger(amount) || amount <= 0 || amount > tenant.outstanding || !date || date > demoToday) { setError('Enter a valid amount within the outstanding balance and a date on or before the demo date.'); return }
    setSaving(true)
    const success = await recordPayment({ id: crypto.randomUUID(), tenantId: tenant.id, propertyId: tenant.propertyId, amount, date, method: String(values.get('method')), reference: String(values.get('reference') ?? '').trim() })
    if (success) { onSaved(); onClose() } else { setError('The balance has changed. Close this form and try again.'); setSaving(false) }
  }
  return <Sheet open onOpenChange={open => { if (!open) onClose() }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg"><SheetHeader className="p-6 pr-12"><SheetTitle>Record Payment</SheetTitle><SheetDescription>{tenant.name} · Outstanding {rupees(tenant.outstanding)}. Demo entry only, no money is collected.</SheetDescription></SheetHeader><form onSubmit={submit} className="flex flex-col gap-6"><FieldGroup className="px-6">{error && <FieldError role="alert">{error}</FieldError>}<Field><FieldLabel htmlFor="payment-amount">Amount (₹)</FieldLabel><Input id="payment-amount" name="amount" type="number" min={1} max={tenant.outstanding} step={1} defaultValue={tenant.outstanding} required /></Field><Field><FieldLabel htmlFor="payment-date">Payment date</FieldLabel><Input id="payment-date" name="date" type="date" defaultValue={demoToday} max={demoToday} required /></Field><Field><FieldLabel htmlFor="payment-method">Payment method</FieldLabel><NativeSelect id="payment-method" name="method">{paymentMethods.map(method => <NativeSelectOption key={method}>{method}</NativeSelectOption>)}</NativeSelect></Field><Field><FieldLabel htmlFor="payment-reference">Reference number</FieldLabel><Input id="payment-reference" name="reference" placeholder="e.g. DEMO-UPI-104" maxLength={80} /></Field></FieldGroup><SheetFooter className="p-6"><Button type="submit" disabled={saving}>Save mock payment</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></SheetFooter></form></SheetContent></Sheet>
}
