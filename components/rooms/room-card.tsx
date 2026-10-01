import { BedDouble, ChevronRight, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { rupees } from '@/lib/properties'
import { roomSummary, sharingType, statusColors, statusLabels, type Bed, type BedStatus, type Room } from '@/lib/rooms'
import { cn } from '@/lib/utils'

export function BedStatusLabel({ status }: { status: BedStatus }) {
  return <span className={cn('inline-flex items-center gap-1.5 text-[10px]', statusColors[status])}><span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />{statusLabels[status]}</span>
}

export function BedList({ beds }: { beds: Bed[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {beds.map(bed => (
        <li key={bed.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
          <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary/60', statusColors[bed.status])}><BedDouble aria-hidden="true" className="size-4" strokeWidth={1.7} /></span>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-xs font-medium">Bed {bed.label}</p><BedStatusLabel status={bed.status} /></div><p className="mt-1 break-words text-[11px] text-muted-foreground">{bed.tenant ?? (bed.status === 'vacant' ? 'Ready for move-in' : bed.status === 'reserved' ? 'Awaiting move-in' : 'Not available')}</p></div>
          <p className="shrink-0 text-right text-xs tabular-nums">{rupees(bed.rent)}<span className="mt-1 block text-[10px] text-muted-foreground">/ month</span></p>
        </li>
      ))}
    </ul>
  )
}

export function RoomCard({ room, onDetails, onAddBed }: { room: Room; onDetails: () => void; onAddBed: () => void }) {
  const stats = roomSummary([room])
  return (
    <Card className="h-full [--card-spacing:--spacing(5)]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2"><CardTitle><h3>Room {room.number}</h3></CardTitle><Badge variant="secondary">{sharingType(room.beds.length)}</Badge></div>
        <CardDescription><span className="text-[11px]">{stats.beds} beds · {stats.occupied} occupied · {stats.vacant} vacant</span></CardDescription>
      </CardHeader>
      <CardContent className="flex-1"><BedList beds={room.beds} /></CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={onDetails} aria-label={`View details for Room ${room.number}`}>Room details<ChevronRight data-icon="inline-end" /></Button>
        <Button variant="outline" size="sm" onClick={onAddBed} disabled={room.beds.length >= 6} aria-label={`Add Bed to Room ${room.number}`}><Plus data-icon="inline-start" />Add Bed</Button>
      </CardFooter>
    </Card>
  )
}
