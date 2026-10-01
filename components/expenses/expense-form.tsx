'use client'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { expenseCategories } from '@/lib/expenses'
import { properties } from '@/lib/properties'
import { usePrototype } from '@/lib/prototype-store'
import { demoToday } from '@/lib/rent'
export function ExpenseForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { update } = usePrototype()
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const text = (key: string) => String(form.get(key) ?? '').trim()
    const amount = Number(form.get('amount'))
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000 || !text('description') || !text('date') || text('date') > demoToday) { setError('Enter a description, a valid date and an amount between ₹1 and ₹1 crore.'); return }
    update(state => ({ ...state, expenses: [{ id: crypto.randomUUID(), propertyId: text('property'), category: text('category'), description: text('description'), amount: Math.round(amount * 100) / 100, date: text('date'), notes: text('notes'), addedBy: 'Rajesh Kumar' }, ...state.expenses] }))
    onSaved(); onClose()
  }
  return <Sheet open onOpenChange={open => { if (!open) onClose() }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg"><SheetHeader className="p-6 pr-12"><SheetTitle>Add Expense</SheetTitle><SheetDescription>A clear record of what it takes to run your PG.</SheetDescription></SheetHeader><form onSubmit={submit}><FieldGroup className="px-6">{error && <FieldError role="alert">{error}</FieldError>}<Field><FieldLabel htmlFor="expense-category">Category</FieldLabel><NativeSelect id="expense-category" name="category">{expenseCategories.map(category => <NativeSelectOption key={category}>{category}</NativeSelectOption>)}</NativeSelect></Field><Field><FieldLabel htmlFor="expense-property">Property</FieldLabel><NativeSelect id="expense-property" name="property">{properties.map(property => <NativeSelectOption key={property.id} value={property.id}>{property.name}</NativeSelectOption>)}</NativeSelect></Field><Field><FieldLabel htmlFor="expense-description">Description</FieldLabel><Input id="expense-description" name="description" required maxLength={200} placeholder="e.g. September electricity bill" /></Field><Field><FieldLabel htmlFor="expense-amount">Amount (₹)</FieldLabel><Input id="expense-amount" name="amount" type="number" min={1} max={10000000} step="0.01" required /></Field><Field><FieldLabel htmlFor="expense-date">Date</FieldLabel><Input id="expense-date" name="date" type="date" defaultValue={demoToday} max={demoToday} required /></Field><Field><FieldLabel htmlFor="expense-notes">Notes</FieldLabel><Input id="expense-notes" name="notes" maxLength={500} placeholder="Optional details" /></Field></FieldGroup><SheetFooter className="p-6"><Button type="submit">Save expense</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></SheetFooter></form></SheetContent></Sheet>
}
