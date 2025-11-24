'use client'

import { useSearchParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import {
    DNSCard,
    PingCard,
    TracerouteCard,
    TLSCard,
    HttpCard,
    MTUMSSCard,
    DockerNetworkCard,
} from '@/components/results/dashboard-cards'

export default function ResultsPage() {
    const searchParams = useSearchParams()
    const rawTarget = searchParams.get('target')
    const target = rawTarget?.trim() ?? ''

    const isLoading = false
    const hasData = false

    const status = isLoading ? 'loading' : hasData ? 'ready' : 'idle'

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Scan Results</h1>
                    <p className="text-sm text-muted-foreground">
                        {target ? (
                            <>
                                Global results dashboard placeholder for{' '}
                                <span className="font-mono text-xs">{target}</span>.
                            </>
                        ) : (
                            'Global results dashboard placeholder. Start a scan from the DNS page or provide a target.'
                        )}
                    </p>
                </div>
                <div className="text-xs text-muted-foreground">
                    Last updated: <span className="font-mono">—</span>
                </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DNSCard status={status} />
                <PingCard status={status} />
                <TracerouteCard status={status} />
                <TLSCard status={status} />
                <HttpCard status={status} />
                <MTUMSSCard status={status} />
                <DockerNetworkCard
                    status={status}
                    className="md:col-span-2 xl:col-span-3"
                />
            </section>
        </div>
    )
}
