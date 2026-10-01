'use client'

import { usePathname, useRouter } from 'next/navigation'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { demoRoles, canNavigate, useDemoRole, type DemoRole } from '@/lib/demo-role'

const routeLabels: Record<string, string> = { dashboard: 'Dashboard', properties: 'Properties', rooms: 'Rooms & Beds', tenants: 'Tenants', rent: 'Rent', expenses: 'Expenses', maintenance: 'Maintenance', vacancies: 'Vacancies', leads: 'Leads', onboarding: 'Onboarding', reports: 'Reports', listings: 'Listings' }
export function RoleSelector() {
  const { role, setRole } = useDemoRole()
  const pathname = usePathname()
  const router = useRouter()
  return <div className="flex min-w-0 flex-col gap-1"><label htmlFor="demo-role" className="text-[10px] text-muted-foreground">Demo role · navigation only</label><NativeSelect id="demo-role" value={role} onChange={event => {
    const next = event.target.value as DemoRole
    if (!demoRoles.includes(next)) return
    void setRole(next)
    if (!canNavigate(next, routeLabels[pathname.split('/')[1]] ?? 'Dashboard')) router.push('/dashboard')
  }}>{demoRoles.map(value => <NativeSelectOption key={value} value={value}>{value}</NativeSelectOption>)}</NativeSelect></div>
}
