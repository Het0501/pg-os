import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { BedList } from '@/components/rooms/room-card'
import { roomStatus, sharingType, type Room } from '@/lib/rooms'

export function RoomDetails({ room, propertyName, onClose, selectedBedId }: { room: Room | null; propertyName: string; onClose: () => void; selectedBedId?: string }) {
  const selectedBed = room?.beds.find(bed => bed.id === selectedBedId)
  return (
    <Sheet open={room !== null} onOpenChange={open => { if (!open) onClose() }}>
      <SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="p-6 pr-12"><SheetTitle>Room {room?.number}{selectedBed ? ` · Bed ${selectedBed.label}` : ''}</SheetTitle><SheetDescription>{propertyName} · Room details</SheetDescription></SheetHeader>
        {room && <div className="flex flex-col gap-6 px-6">
          <dl className="grid grid-cols-2 gap-5 text-xs">
            {[
              ['Room number', room.number], ['Sharing type', sharingType(room.beds.length)],
              ['Floor', String(room.floor)], ['Room status', roomStatus(room)],
              ['Total beds', String(room.beds.length)], ['Current occupants', String(room.beds.filter(bed => bed.status === 'occupied').length)],
            ].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1.5 font-medium">{value}</dd></div>)}
          </dl>
          <Separator />
          <section className="flex flex-col gap-3" aria-labelledby="room-occupants-heading"><h3 id="room-occupants-heading" className="text-sm font-medium">Beds, occupants & monthly rent</h3><BedList beds={room.beds} /></section>
          <p className="text-[11px] leading-relaxed text-muted-foreground">Sample occupants and monthly rents only. No tenant or payment records are managed here.</p>
        </div>}
        <SheetFooter className="p-6"><Button variant="outline" onClick={onClose}>Back to rooms</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
