'use client'

import useSWR from 'swr'

export const demoRoles = ['OWNER', 'MANAGER', 'STAFF'] as const
export type DemoRole = typeof demoRoles[number]
const staffModules = new Set(['Dashboard', 'Rooms & Beds', 'Tenants', 'Maintenance', 'Vacancies', 'Notifications'])
export function canNavigate(role: DemoRole, label: string) {
  if (role === 'STAFF') return staffModules.has(label)
  if (role === 'MANAGER') return label !== 'Settings'
  return true
}
export function useDemoRole() {
  const { data: role = 'OWNER', mutate } = useSWR<DemoRole>('pg-os-demo-role', null, { fallbackData: 'OWNER', revalidateOnFocus: false })
  return { role, setRole: (next: DemoRole) => mutate(next, { revalidate: false }) }
}
