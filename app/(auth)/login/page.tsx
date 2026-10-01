import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, BedDouble, Users, Layers3, ShieldCheck } from 'lucide-react'
import { Brand } from '@/components/layout/sidebar'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-border bg-sidebar p-12 lg:flex lg:flex-col xl:p-16" aria-label="Welcome to PG OS">
        <Brand />
        <div className="relative my-auto py-20">
          <Badge variant="outline"><span className="mr-1 size-1.5 rounded-full bg-primary" />Your property. Your perspective.</Badge>
          <h1 className="mt-7 max-w-lg text-5xl leading-[1.13] font-medium tracking-[-0.055em] xl:text-6xl">Less managing.<br /><span className="text-primary">More growing.</span></h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">A clearer view of your PG business. Your properties, people, and everyday operations — together in one workspace.</p>
          <div className="relative mt-12 max-w-md rounded-2xl border border-border bg-background p-6">
            <div className="mb-6 flex items-center justify-between"><span className="text-xs font-medium">Your portfolio, connected.</span><Layers3 className="size-4 text-primary" /></div>
            <div className="grid grid-cols-3 gap-3">{[{ icon: Building2, value: '3', label: 'Properties' }, { icon: BedDouble, value: '246', label: 'Beds' }, { icon: Users, value: '228', label: 'Residents' }].map(({ icon: Icon, value, label }) => <div key={label} className="flex flex-col gap-3 border-l border-border pl-4 first:border-0 first:pl-0"><Icon className="size-4 text-muted-foreground" /><span className="text-2xl tracking-tight">{value}</span><span className="text-[11px] text-muted-foreground">{label}</span></div>)}</div>
            <p className="mt-6 text-[10px] text-muted-foreground">A preview of your workspace · Sample data</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Built for the people behind every great PG.</p>
      </section>
      <section className="flex min-w-0 flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between lg:justify-end"><div className="lg:hidden"><Brand /></div><Badge variant="outline">Prototype preview</Badge></div>
        <div className="mx-auto my-auto w-full max-w-[360px] py-16">
          <span className="mb-7 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-accent text-primary"><Building2 className="size-6" /></span>
          <h2 className="text-3xl font-medium tracking-[-0.04em]">Welcome back.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Your workspace is ready when you are.</p>
          <div className="mt-9">
            <FieldGroup>
              <Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" type="email" placeholder="owner@pgos.demo" autoComplete="off" className="h-11" /></Field>
              <Field><FieldLabel htmlFor="password">Password</FieldLabel><Input id="password" type="password" placeholder="Enter your password" autoComplete="off" className="h-11" /></Field>
            </FieldGroup>
            <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }), 'mt-7 h-11 w-full justify-between px-4')}>Sign in<ArrowRight data-icon="inline-end" /></Link>
          </div>
          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border p-3.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-xs leading-relaxed text-muted-foreground">This is a product prototype. No credentials are needed or saved. Sign in to explore the demo workspace.</p></div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">PG OS · Property Operations, simplified.</p>
      </section>
    </main>
  )
}
