'use client'

import { useId, type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { properties } from '@/lib/properties'

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-5"><div><p className="section-eyebrow mb-3">{eyebrow}</p><h1 className="text-[30px] leading-tight font-medium tracking-[-0.045em]">{title}</h1><p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p></div>{action}</div>
}
export function Metrics({ items }: { items: { label: string; value: ReactNode; hint?: string }[] }) {
  return <section aria-label="Overview" className="grid grid-cols-2 gap-3 xl:grid-cols-5">{items.map((item, index) => <Card key={item.label} className="stat-card" data-highlight={index === 0}><CardHeader><CardTitle><span className="text-[11px] font-normal text-muted-foreground">{item.label}</span></CardTitle></CardHeader><CardContent><p className="metric-value break-words !text-[clamp(1.25rem,2.4vw,2rem)]">{item.value}</p>{item.hint && <p className="mt-2 text-[10px] text-muted-foreground">{item.hint}</p>}</CardContent></Card>)}</section>
}
export function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  const id = useId()
  return <Field className="min-w-40 flex-1"><FieldLabel htmlFor={id}>{label}</FieldLabel><NativeSelect id={id} className="w-full" value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>)}</NativeSelect></Field>
}
export function PropertyFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <Filter label="Property" value={value} onChange={onChange} options={[{ value: 'all', label: 'All properties' }, ...properties.map(item => ({ value: item.id, label: item.name }))]} /> }
export function NoResults() { return <Empty className="border py-12"><EmptyHeader><EmptyTitle>No matching records</EmptyTitle><EmptyDescription>Try another property, search term or filter.</EmptyDescription></EmptyHeader></Empty> }
export function Notice({ message }: { message: string }) { return message ? <Alert role="status"><AlertTitle>Prototype update</AlertTitle><AlertDescription>{message}</AlertDescription></Alert> : null }
export function DemoFooter() { return <footer className="border-t border-border pt-4 text-[10px] leading-relaxed text-muted-foreground">September 2026 demo · Shared sample data. Changes reset on reload. No real payments or messages are sent.</footer> }
