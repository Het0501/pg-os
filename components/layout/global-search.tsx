'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BedDouble, Building2, DoorOpen, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { usePrototype } from '@/lib/prototype-store'
import { searchWorkspace } from '@/lib/global-search'

const icons = { Tenants: Users, Properties: Building2, Rooms: DoorOpen, Beds: BedDouble }

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { tenants, rooms } = usePrototype()
  const router = useRouter()
  const groups = useMemo(() => searchWorkspace(query, tenants, rooms), [query, tenants, rooms])
  const count = groups.reduce((total, group) => total + group.total, 0)

  function changeOpen(value: boolean) { setOpen(value); if (value) setQuery('') }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault()
        setOpen(value => !value)
        setQuery('')
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])

  return <Dialog open={open} onOpenChange={changeOpen}>
    <DialogTrigger render={<Button variant="ghost" className="w-full justify-start gap-2 md:w-52 xl:w-64" aria-label="Search workspace" />}>
      <Search data-icon="inline-start" /><span className="truncate">Search workspace...</span><kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground xl:block">⌘ / Ctrl K</kbd>
    </DialogTrigger>
    <DialogContent className="top-[8svh] max-h-[84svh] -translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl" showCloseButton>
      <DialogHeader className="p-5 pr-12"><DialogTitle>Search workspace</DialogTitle><DialogDescription>Find tenants, properties, rooms and beds.</DialogDescription></DialogHeader>
      <Command shouldFilter={false} loop onKeyDownCapture={event => {
        if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) { event.preventDefault(); event.stopPropagation() }
      }}>
        <CommandInput autoFocus aria-label="Search tenants, properties, rooms and beds" placeholder="Name, property, room or bed…" value={query} onValueChange={setQuery} />
        <CommandList className="max-h-[min(50svh,400px)]" aria-label="Workspace search results">
          {query.trim() ? <>
            <CommandEmpty><p>No matches found</p><p className="mt-1 text-xs text-muted-foreground">Try a different name, property, room number or bed.</p></CommandEmpty>
            {groups.filter(group => group.total > 0).map(group => {
              const Icon = icons[group.type]
              return <CommandGroup key={group.type} heading={`${group.type} · ${group.total}${group.total > group.results.length ? ` (first ${group.results.length})` : ''}`}>
                {group.results.map(result => <CommandItem key={result.id} value={`${group.type}:${result.id}`} className="gap-3 py-3" onSelect={() => { setOpen(false); router.push(result.href) }}>
                  <Icon aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="truncate">{result.title}</span><span className="truncate text-xs text-muted-foreground">{result.description}</span></span>
                  <Badge variant="outline">{group.type === 'Properties' ? 'Property' : group.type.slice(0, -1)}</Badge>
                </CommandItem>)}
              </CommandGroup>
            })}
          </> : <div className="flex flex-col gap-2 px-5 py-10 text-center"><Search className="mx-auto mb-1 size-5 text-muted-foreground" /><p className="text-sm">Your workspace, one search away</p><p className="text-xs text-muted-foreground">Try “Rahul”, “Green Nest”, “Room 101” or “Bed A”.</p></div>}
        </CommandList>
      </Command>
      <div className="flex flex-wrap justify-between gap-2 border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><span role="status">{query.trim() ? `${count} matching results` : 'Search shared prototype data'}</span><span>↑ ↓ Navigate · Enter Open · Esc Close</span></div>
    </DialogContent>
  </Dialog>
}
