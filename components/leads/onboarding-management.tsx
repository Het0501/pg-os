'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { PageHeader, Metrics, Notice, DemoFooter, NoResults } from '@/components/operations/shared'
import { usePrototype } from '@/lib/prototype-store'
import { OnboardingForm } from './onboarding-form'
import { AssignmentSheet } from './assignment-sheet'

export function OnboardingManagement() {
  const { onboarding, tenants, update } = usePrototype()
  const [adding, setAdding] = useState(false)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [assignId, setAssignId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const reviewing = onboarding.find(item => item.id === reviewId)
  const assigning = onboarding.find(item => item.id === assignId)
  const currentKyc = reviewing ? tenants.find(tenant => tenant.id === reviewing.tenantId)?.kyc ?? reviewing.kyc : 'Pending'
  function completeKyc(id: string) {
    update(state => ({ ...state, onboarding: state.onboarding.map(item => item.id === id ? { ...item, kyc: 'Complete' } : item), tenants: state.tenants.map(tenant => tenant.onboardingId === id ? { ...tenant, kyc: 'Complete' } : tenant) }))
    setNotice('KYC marked complete in the prototype. No real identity verification was performed.')
  }
  return <div className="dashboard-enter flex min-w-0 flex-col gap-8"><PageHeader eyebrow="A thoughtful welcome" title="Tenant onboarding" description="Collect sample details, review applications and assign a vacant bed." action={<Button onClick={() => setAdding(true)}><Plus data-icon="inline-start" />New application</Button>} /><Metrics items={[{ label: 'Applications', value: onboarding.length }, { label: 'Pending approval', value: onboarding.filter(item => item.status === 'Pending approval').length }, { label: 'Approved', value: onboarding.filter(item => item.status === 'Approved').length }, { label: 'KYC pending', value: onboarding.filter(item => (tenants.find(tenant => tenant.id === item.tenantId)?.kyc ?? item.kyc) === 'Pending').length }]} /><Notice message={notice} />
    {onboarding.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{onboarding.map(item => <Card key={item.id}><CardHeader><Badge variant="secondary" className="mb-3 w-fit">{item.status}</Badge><CardTitle>{item.name}</CardTitle><CardDescription>{item.occupation} · {item.city}</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">{item.phone}</p><p className="mt-2 text-xs text-muted-foreground">KYC: {tenants.find(tenant => tenant.id === item.tenantId)?.kyc ?? item.kyc}</p></CardContent><CardFooter><Button variant="outline" onClick={() => setReviewId(item.id)}>Review application</Button></CardFooter></Card>)}</div> : <><NoResults /><p className="text-sm text-muted-foreground">Start with New application. Submitted details wait for owner approval; no bed is occupied until confirmation.</p></>}
    <DemoFooter />
    {reviewing && <Sheet open onOpenChange={open => { if (!open) setReviewId(null) }}><SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl"><SheetHeader className="p-6 pr-12"><SheetTitle>Review {reviewing.name}</SheetTitle><SheetDescription>{reviewing.status} · Owner review · Sample information only</SheetDescription></SheetHeader><div className="flex flex-col gap-6 p-6 pt-0"><dl className="grid gap-4 sm:grid-cols-2">{Object.entries({ Name: reviewing.name, Phone: reviewing.phone, Email: reviewing.email, 'Date of birth': reviewing.dob, Gender: reviewing.gender, Address: reviewing.address, City: reviewing.city, State: reviewing.state, Pincode: reviewing.pincode, 'Emergency contact': reviewing.emergencyName, Relationship: reviewing.relationship, 'Emergency phone': reviewing.emergencyPhone, Occupation: reviewing.occupation, 'College / company': reviewing.organization, 'Course / designation': reviewing.designation, Identification: `${reviewing.idType} · •••• ${reviewing.idLastFour}`, 'KYC status': currentKyc, 'Profile photo': reviewing.photo, 'ID document': reviewing.document, 'Other document': reviewing.otherDocument }).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm">{value || 'Not provided'}</dd></div>)}</dl>{currentKyc === 'Pending' && <Button variant="outline" onClick={() => completeKyc(reviewing.id)}>Mark KYC complete (demo)</Button>}{reviewing.tenantId ? <Link href={`/tenants?tenant=${reviewing.tenantId}`} className={buttonVariants()}>View tenant</Link> : <Button onClick={() => { setAssignId(reviewing.id); setReviewId(null) }}>Approve & assign bed</Button>}</div></SheetContent></Sheet>}
    {adding && <OnboardingForm onClose={() => setAdding(false)} onSaved={() => { setAdding(false); setNotice('Application submitted. Pending owner approval; no tenant or bed assignment has been created yet.') }} />}
    {assigning && <AssignmentSheet kind="onboarding" id={assigning.id} name={assigning.name} onClose={() => setAssignId(null)} onDone={() => { setAssignId(null); setNotice(`${assigning.name} approved. Tenant created and bed occupied across the workspace.`) }} />}
  </div>
}
