import type { Metadata } from 'next'
import { TenantsManagement } from '@/components/tenants/tenants-management'

export const metadata: Metadata = {
  title: 'Tenants',
  description: 'Manage tenant profiles, stay details, KYC and rent status in the PG OS mock workspace.',
}

export default async function TenantsPage({ searchParams }: { searchParams: Promise<{ tenant?: string | string[] }> }) {
  const params = await searchParams
  const tenantId = typeof params.tenant === 'string' ? params.tenant : undefined
  return <TenantsManagement key={tenantId ?? 'all'} initialTenantId={tenantId} />
}
