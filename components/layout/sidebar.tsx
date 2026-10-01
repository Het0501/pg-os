'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, BedDouble, Users, Wallet, ReceiptText, Wrench, DoorOpen, ContactRound, ChartNoAxesCombined, Bell, Settings2, ChevronsUpDown, Layers3, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { usePrototype } from '@/lib/prototype-store'
import { canNavigate, useDemoRole } from '@/lib/demo-role'

const navigation: { label: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Properties', icon: Building2 },
  { label: 'Rooms & Beds', icon: BedDouble },
  { label: 'Tenants', icon: Users },
  { label: 'Rent', icon: Wallet },
  { label: 'Expenses', icon: ReceiptText },
  { label: 'Maintenance', icon: Wrench },
  { label: 'Vacancies', icon: DoorOpen },
  { label: 'Leads', icon: ContactRound },
  { label: 'Reports', icon: ChartNoAxesCombined },
  { label: 'Onboarding', icon: ContactRound },
  { label: 'Listings', icon: Building2 },
]

export function Brand() {
  return (
    <Link href="/dashboard" className="flex w-fit items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-primary" aria-label="PG OS dashboard">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Building2 className="size-6" strokeWidth={1.8} /></span>
      <span className="flex flex-col gap-0.5"><span className="text-xl leading-none font-semibold tracking-[-0.06em]">PG OS<span className="text-primary">.</span></span><span className="text-[10px] tracking-wide text-muted-foreground">Property Operations</span></span>
    </Link>
  )
}

export function Sidebar({ onPlaceholder, onNavigate, onNotifications, notificationsOpen }: { onPlaceholder: (label: string) => void; onNavigate?: () => void; onNotifications: () => void; notificationsOpen: boolean }) {
  const pathname = usePathname()
  const { unreadCount } = usePrototype()
  const { role } = useDemoRole()
  const activeLabel = pathname.startsWith('/leads') ? 'Leads' : pathname.startsWith('/onboarding') ? 'Onboarding' : pathname.startsWith('/reports') ? 'Reports' : pathname.startsWith('/maintenance') ? 'Maintenance' : pathname.startsWith('/vacancies') ? 'Vacancies' : pathname.startsWith('/expenses') ? 'Expenses' : pathname.startsWith('/rent') ? 'Rent' : pathname.startsWith('/tenants') ? 'Tenants' : pathname.startsWith('/rooms') ? 'Rooms & Beds' : pathname.startsWith('/properties') ? 'Properties' : 'Dashboard'
  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar">
      <div className="px-6 pt-7 pb-7"><Brand /></div>
      <div className="mx-4 mb-7 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-3">
        <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary"><Building2 className="size-4 text-muted-foreground" /></span>
        <div className="min-w-0 flex-1"><p className="text-xs font-medium">Rajesh&apos;s workspace</p><p className="mt-0.5 text-[10px] text-muted-foreground">{role.charAt(0) + role.slice(1).toLowerCase()} demo workspace</p></div>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </div>
      <nav aria-label="Main navigation" className="min-h-0 flex-1 overflow-y-auto px-4">
        <p className="section-eyebrow mb-3 px-3">Workspace</p>
        <ul className="flex flex-col gap-1">
          {navigation.filter(item => canNavigate(role, item.label)).map(({ label, icon: Icon }) => (
            <li key={label}>
              {label === 'Onboarding' || label === 'Listings' || label === 'Dashboard' || label === 'Properties' || label === 'Rooms & Beds' || label === 'Tenants' || label === 'Rent' || label === 'Expenses' || label === 'Maintenance' || label === 'Vacancies' || label === 'Reports' || label === 'Leads' ? (
                <Link href={label === 'Listings' ? '/listings' : label === 'Onboarding' ? '/onboarding' : label === 'Leads' ? '/leads' : label === 'Reports' ? '/reports' : label === 'Maintenance' ? '/maintenance' : label === 'Vacancies' ? '/vacancies' : label === 'Expenses' ? '/expenses' : label === 'Rent' ? '/rent' : label === 'Tenants' ? '/tenants' : label === 'Rooms & Beds' ? '/rooms' : label === 'Properties' ? '/properties' : '/dashboard'} aria-current={label === activeLabel ? 'page' : undefined} onClick={onNavigate} className="nav-link"><Icon className="size-[17px]" strokeWidth={1.7} />{label}{label === activeLabel && <span className="ml-auto size-1.5 rounded-full bg-primary" />}</Link>
              ) : (
                <button type="button" className="nav-link" onClick={() => onPlaceholder(label)} title={`${label} — coming in a future step`}><Icon className="size-[17px]" strokeWidth={1.7} />{label}</button>
              )}
            </li>
          ))}
        </ul>
        <Separator className="my-5" />
        <ul className="flex flex-col gap-1">
          <li><button type="button" className="nav-link" aria-haspopup="dialog" aria-expanded={notificationsOpen} onClick={onNotifications}><Bell className="size-[17px]" strokeWidth={1.7} />Notifications{unreadCount > 0 && <Badge variant="secondary" className="ml-auto" aria-label={`${unreadCount} unread`}>{unreadCount}</Badge>}</button></li>
          {canNavigate(role, 'Settings') && <li><button type="button" className="nav-link" onClick={() => onPlaceholder('Settings')}><Settings2 className="size-[17px]" strokeWidth={1.7} />Settings</button></li>}
        </ul>
      </nav>
      <div className="m-4 mt-6 rounded-xl border border-border p-3.5">
        <div className="mb-2 flex items-center justify-between"><Layers3 className="size-4 text-primary" /><Badge variant="outline">Preview</Badge></div>
        <p className="text-xs font-medium">A better way to run your PG.</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">Your operations, all in one place.<br />You&apos;re exploring the prototype.</p>
        <Link href="/login" onClick={onNavigate} className="mt-3 flex items-center justify-between text-[11px] text-primary hover:underline">View demo login<ArrowUpRight className="size-3.5" /></Link>
      </div>
      <div className="flex items-center gap-2 border-t border-border px-6 py-4 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />PG OS <span className="ml-auto">v0.1 · Prototype</span></div>
    </div>
  )
}
