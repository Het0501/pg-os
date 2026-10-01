'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, DoorOpen, ShieldCheck, Wallet, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { usePrototype } from '@/lib/prototype-store'
import { cn } from '@/lib/utils'

const icons = { rent: Wallet, maintenance: Wrench, vacancy: DoorOpen, attention: ShieldCheck }
const labels = { rent: 'Rent', maintenance: 'Maintenance', vacancy: 'Vacancy', attention: 'Attention' }

export function NotificationCenter({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { notifications, unreadCount, readNotificationIds, markNotificationRead, markAllNotificationsRead } = usePrototype()
  const [unreadOnly, setUnreadOnly] = useState(false)
  const visible = unreadOnly ? notifications.filter(item => !readNotificationIds.includes(item.id)) : notifications

  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
      <SheetHeader className="gap-2 border-b border-border p-5 pr-12">
        <SheetTitle>Notifications</SheetTitle><SheetDescription>Operational updates from your workspace.</SheetDescription>
        <p role="status" className="text-xs text-primary">{unreadCount ? `${unreadCount} unread` : 'All caught up'}</p>
      </SheetHeader>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" className="size-4 accent-primary" checked={unreadOnly} onChange={event => setUnreadOnly(event.target.checked)} />Unread only</label>
        <Button variant="ghost" size="sm" disabled={!unreadCount} onClick={() => void markAllNotificationsRead()}><CheckCheck data-icon="inline-start" />Mark all as read</Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {visible.length ? <ul className="divide-y divide-border">{visible.map(item => {
          const read = readNotificationIds.includes(item.id)
          const Icon = icons[item.kind]
          return <li key={item.id} className={cn('flex items-start gap-3 p-5', !read && 'bg-accent/30')}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card"><Icon className="size-4 text-primary" aria-hidden="true" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{labels[item.kind]}</Badge><span className={cn('text-[10px]', read ? 'text-muted-foreground' : 'text-primary')}>{read ? 'Read' : 'Unread'}</span></div>
              <Link href={item.href} className="rounded-sm text-sm leading-relaxed font-medium break-words hover:text-primary focus-visible:outline-2 focus-visible:outline-primary" onClick={() => { void markNotificationRead(item.id); onOpenChange(false) }}>{item.title}</Link>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
              {!read && <Button variant="ghost" size="xs" className="self-start" aria-label={`Mark read: ${item.title}`} onClick={() => void markNotificationRead(item.id)}><Check data-icon="inline-start" />Mark read</Button>}
            </div>
          </li>
        })}</ul> : <Empty className="px-6 py-12"><EmptyHeader><EmptyMedia variant="icon"><Bell /></EmptyMedia><EmptyTitle>{unreadOnly ? 'No unread notifications' : 'No notifications'}</EmptyTitle><EmptyDescription>{unreadOnly ? 'You’re all caught up. Turn off the unread filter to review updates.' : 'No operational items need your attention right now.'}</EmptyDescription></EmptyHeader></Empty>}
      </div>
      <p className="border-t border-border p-4 text-[10px] leading-relaxed text-muted-foreground">September 2026 demo · Read state is shared for this session and resets on reload. Reading an update does not resolve it.</p>
    </SheetContent>
  </Sheet>
}
