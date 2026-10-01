'use client'

import { Bell, Building2, Check, ChevronDown, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/layout/global-search'
import { RoleSelector } from '@/components/layout/role-selector'
import { useDemoRole } from '@/lib/demo-role'
import { usePrototype } from '@/lib/prototype-store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function Topbar({ onMenu, onNotifications, notificationsOpen }: { onMenu: () => void; onNotifications: () => void; notificationsOpen: boolean }) {
  const pathname = usePathname()
  const { unreadCount } = usePrototype()
  const { role } = useDemoRole()
  return (
    <header className="flex min-h-[76px] flex-wrap items-center gap-3 border-b border-border bg-background px-5 py-3 md:px-8 lg:flex-nowrap lg:px-9">
      <Button variant="ghost" size="icon" onClick={onMenu} className="lg:hidden" aria-label="Open navigation"><Menu /></Button>
      <p className="text-sm font-medium">{pathname.startsWith('/leads') ? 'Leads' : pathname.startsWith('/onboarding') ? 'Onboarding' : pathname.startsWith('/reports') ? 'Reports' : pathname.startsWith('/maintenance') ? 'Maintenance' : pathname.startsWith('/vacancies') ? 'Vacancies' : pathname.startsWith('/expenses') ? 'Expenses' : pathname.startsWith('/rent') ? 'Rent' : pathname.startsWith('/tenants') ? 'Tenants' : pathname.startsWith('/rooms') ? 'Rooms & Beds' : pathname.startsWith('/properties') ? 'Properties' : 'Dashboard'}</p>
      <div className="order-last flex w-full items-center gap-2 md:order-none md:ml-auto md:w-auto">
        <GlobalSearch />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-3 md:gap-4">
        <RoleSelector />
        <div className="hidden xl:block">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="h-9 gap-2 px-3" />}><Building2 data-icon="inline-start" />All Properties<ChevronDown data-icon="inline-end" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup><DropdownMenuLabel>Prototype workspace</DropdownMenuLabel><DropdownMenuItem><Check />All Properties</DropdownMenuItem><DropdownMenuItem disabled>Property filters coming soon</DropdownMenuItem></DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notificationsOpen} onClick={onNotifications}><Bell />{unreadCount > 0 && <span aria-hidden="true" className="absolute -top-0.5 -right-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground">{unreadCount > 99 ? '99+' : unreadCount}</span>}</Button>
        <div className="flex items-center gap-2.5 border-l border-border pl-3 md:pl-4">
          <span className="flex size-8 items-center justify-center rounded-full border border-primary/20 bg-accent text-[10px] font-semibold text-primary" aria-label="Rajesh Kumar avatar">RK</span>
          <div className="hidden xl:block"><p className="text-xs font-medium">Rajesh Kumar</p><p className="mt-0.5 text-[10px] text-muted-foreground">{role.charAt(0) + role.slice(1).toLowerCase()}</p></div>
        </div>
      </div>
    </header>
  )
}
