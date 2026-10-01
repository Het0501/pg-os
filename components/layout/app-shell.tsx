'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { NotificationCenter } from '@/components/layout/notification-center'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  function openNotifications() {
    setMobileOpen(false)
    setNotificationsOpen(true)
  }

  function showPlaceholder(label: string) {
    setNotice(`${label} is coming in a future step. You're viewing the PG OS prototype.`)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-svh">
      <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 rounded-md bg-primary p-3 text-primary-foreground focus:not-sr-only">Skip to content</a>
      <aside aria-label="Workspace sidebar" className="fixed inset-y-0 left-0 hidden w-[232px] border-r border-border lg:block"><Sidebar onNotifications={openNotifications} notificationsOpen={notificationsOpen} onPlaceholder={showPlaceholder} /></aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="max-w-[280px] gap-0">
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigate the PG OS prototype workspace.</SheetDescription>
          <Sidebar onNotifications={openNotifications} notificationsOpen={notificationsOpen} onPlaceholder={showPlaceholder} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="min-w-0 lg:ml-[232px]">
        <Topbar onMenu={() => setMobileOpen(true)} onNotifications={openNotifications} notificationsOpen={notificationsOpen} />
        <main id="main-content" className="mx-auto max-w-[1500px] px-5 pt-8 pb-6 md:px-8 lg:px-9 lg:pt-10">{children}</main>
      </div>
      <NotificationCenter open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      {notice && <div role="status" className="fixed right-4 bottom-4 left-4 z-40 flex items-start gap-3 rounded-xl border border-border bg-popover p-4 text-sm shadow-2xl sm:left-auto sm:max-w-sm"><Info className="mt-0.5 size-4 shrink-0 text-primary" /><p className="flex-1 leading-relaxed">{notice}</p><Button variant="ghost" size="icon-xs" aria-label="Dismiss notice" onClick={() => setNotice(null)}><X /></Button></div>}
    </div>
  )
}
