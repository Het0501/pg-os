'use client'

import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function AddProperty() {
  return (
    <Sheet>
      <SheetTrigger render={<Button size="lg" />}><Plus data-icon="inline-start" />Add Property</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="gap-3 pt-12">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent text-primary"><Building2 className="size-6" /></span>
          <Badge variant="outline" className="w-fit">Prototype preview</Badge>
          <SheetTitle>Add Property</SheetTitle>
          <SheetDescription>Property creation is coming in a future step. This preview includes three sample properties to explore; no changes will be saved.</SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm leading-relaxed text-muted-foreground">For now, open a property to review its rooms, bed availability, occupancy, and financial overview.</div>
        <SheetFooter><SheetClose render={<Button variant="outline" />}>Back to properties</SheetClose></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
