'use client'
import Link from 'next/link'
import { usePrototype } from '@/lib/prototype-store'
import { financials } from '@/lib/financials'
import { properties, rupees } from '@/lib/properties'
import { FinancialCharts } from './financial-charts'
import { ArrowDownLeft, ArrowUpRight, BedDouble, Building2, CalendarDays, CircleCheck, CircleDashed, Clock3, DoorOpen, Info, ReceiptText, Users, Wallet, Wrench, type LucideIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function useDashboardMetrics() {
  const state = usePrototype()
  const totals = financials(state)
  return {
    propertyMetrics: [
      { label: 'Properties', value: String(properties.length), description: 'Across your portfolio', icon: Building2 },
      { label: 'Total Beds', value: String(totals.beds), description: `${totals.vacant} vacant · ${totals.reserved} reserved · ${totals.maintenance} maintenance`, icon: BedDouble },
      { label: 'Occupied', value: String(totals.occupied), description: 'Beds currently occupied', icon: Users },
      { label: 'Occupancy', value: `${totals.occupancy.toFixed(1)}%`, description: 'Of your total capacity', icon: CircleDashed, highlight: true },
    ],
    financialMetrics: [
      { label: 'Expected Rent', value: rupees(totals.expected), description: 'Total rent for this month', icon: Wallet },
      { label: 'Collected', value: rupees(totals.collected), description: 'Recorded September payments', icon: ArrowDownLeft, highlight: true },
      { label: 'Pending', value: rupees(totals.pending), description: 'Yet to be collected', icon: Clock3 },
      { label: 'Expenses', value: rupees(totals.spent), description: 'Including maintenance costs', icon: ArrowUpRight },
      { label: 'Operating Profit', value: rupees(totals.profit), description: 'Collected revenue − expenses', icon: ReceiptText, highlight: true },
    ],
    attentionItems: [
      { icon: Wallet, title: `${totals.tenants.filter(t => t.outstanding > 0).length} tenants have pending rent`, detail: rupees(totals.pending), status: 'Follow up', warning: true, href: '/rent' },
      { icon: BedDouble, title: `${totals.vacant} beds vacant`, detail: 'Bed availability', status: 'Available', warning: false, href: '/vacancies' },
      { icon: Wrench, title: `${state.maintenance.filter(t => t.status !== 'Resolved').length} maintenance requests unresolved`, detail: 'Property upkeep', status: 'Needs review', warning: true, href: '/maintenance' },
      { icon: DoorOpen, title: `${totals.tenants.filter(t => t.moveOut >= '2026-09-21' && t.moveOut <= '2026-09-28').length} move-outs this week`, detail: 'Upcoming departures', status: 'This week', warning: false, href: '/tenants' },
      { icon: ReceiptText, title: `${rupees(totals.spent)} current expenses`, detail: 'September operations', status: 'Review ledger', warning: false, href: '/expenses' },
    ],
  }
}

type Metric = { label: string; value: string; description: string; icon: LucideIcon; highlight?: boolean }


function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon
  return (
    <Card className="stat-card" data-highlight={metric.highlight}>
      <CardHeader className="flex flex-row items-center justify-between gap-2"><CardTitle><span className="text-[13px] font-normal text-muted-foreground">{metric.label}</span></CardTitle><span className="metric-icon"><Icon className="size-[17px]" strokeWidth={1.7} /></span></CardHeader>
      <CardContent><p className="metric-value">{metric.value}</p><p className="mt-2 text-[11px] text-muted-foreground">{metric.description}</p></CardContent>
    </Card>
  )
}

function MetricSection({ title, subtitle, metrics, financial = false }: { title: string; subtitle: string; metrics: Metric[]; financial?: boolean }) {
  return (
    <section aria-label={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-3"><h2 className="text-sm font-medium">{title}</h2><span className="hidden text-xs text-muted-foreground sm:inline">{subtitle}</span></div>{financial && <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><CalendarDays className="size-3.5" />September 2026</span>}</div>
      <div className={financial ? 'grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 xl:grid-cols-5' : 'grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 xl:grid-cols-4'}>{metrics.map(metric => <MetricCard key={metric.label} metric={metric} />)}</div>
    </section>
  )
}

function RequiresAttention({ items }: { items: ReturnType<typeof useDashboardMetrics>['attentionItems'] }) {
  return (
    <section aria-labelledby="attention-heading">
      <Card className="gap-0 [--card-spacing:--spacing(5)] ring-border">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3 pb-5 sm:flex-row">
          <div className="flex items-center gap-2.5"><span className="flex size-7 items-center justify-center rounded-lg bg-warning/10 text-warning"><Clock3 className="size-4" /></span><h2 id="attention-heading" className="text-sm font-medium">Requires Attention</h2><Badge variant="secondary">{items.length}</Badge></div>
          <p className="text-xs text-muted-foreground">A few things to keep on your radar.</p>
        </CardHeader>
        <Separator />
        <CardContent className="px-0">
          <ul className="divide-y divide-border/70">
            {items.map(({ icon: Icon, title, detail, status, warning, href }) => (
              <li key={title} className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-secondary/30">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground"><Icon className="size-4" strokeWidth={1.7} /></span>
                <div className="min-w-0 flex-1"><Link href={href} className="text-xs font-medium hover:underline sm:text-[13px]">{title}</Link><p className="mt-1 text-[10px] text-muted-foreground sm:hidden">{detail}</p></div>
                <span className="mr-4 hidden w-36 text-xs text-muted-foreground md:block">{detail}</span>
                <span className="flex w-24 shrink-0 items-center gap-1.5 text-[10px] text-muted-foreground sm:text-[11px]"><span className={warning ? 'size-1.5 shrink-0 rounded-full bg-warning' : 'size-1.5 shrink-0 rounded-full bg-muted-foreground'} />{status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

export default function DashboardOverview() {
  const { propertyMetrics, financialMetrics, attentionItems } = useDashboardMetrics()
  return (
    <div className="dashboard-enter flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div><div className="mb-3 flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /><p className="section-eyebrow">Your business, at a glance</p></div><h1 className="text-[26px] leading-tight font-medium tracking-[-0.045em] sm:text-[30px]">Good morning, Rajesh <span className="ml-1 inline-block text-[25px]" role="img" aria-label="waving hand">👋</span></h1><p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">Here&apos;s what&apos;s happening across your PG business today.</p></div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /><span>Monday, 21 September 2026</span></div>
      </div>
      <MetricSection title="Portfolio overview" subtitle="The big picture, in a glance." metrics={propertyMetrics} />
      <MetricSection title="Financial overview" subtitle="Every rupee, accounted for." metrics={financialMetrics} financial />
      <FinancialCharts />
      <RequiresAttention items={attentionItems} />
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[10px] text-muted-foreground"><p className="flex items-center gap-1.5"><Info className="size-3" />Prototype workspace · All figures are sample data.</p><p className="flex items-center gap-1.5"><CircleCheck className="size-3 text-primary" />A little more clarity. A lot more control.</p></footer>
    </div>
  )
}
