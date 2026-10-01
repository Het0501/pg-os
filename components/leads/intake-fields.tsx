'use client'

import { useId, type ComponentProps } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

export function IntakeInput({ label, ...props }: ComponentProps<typeof Input> & { label: string }) {
  const id = useId()
  return <Field><FieldLabel htmlFor={id}>{label}</FieldLabel><Input id={id} maxLength={200} {...props} /></Field>
}
export function IntakeSelect({ label, options, ...props }: ComponentProps<typeof NativeSelect> & { label: string; options: { value: string; label: string }[] }) {
  const id = useId()
  return <Field data-disabled={props.disabled}><FieldLabel htmlFor={id}>{label}</FieldLabel><NativeSelect id={id} className="w-full" {...props}>{options.map(option => <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>)}</NativeSelect></Field>
}
export const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }))
