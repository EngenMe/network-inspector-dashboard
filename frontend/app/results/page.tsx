'use client'

import { useSearchParams } from 'next/navigation'
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
    const hasData = true

    const dockerData = {
        networks: [{ name: 'bridge0', driver: 'bridge', subnet: '172.18.0.0/16' }],
        containers: [
            {
                id: '1234567890abc',
                name: 'backend',
                status: 'running',
                networks: ['bridge0'],
            },
        ],
        error: null,
    }

    const status = isLoading ? 'loading' : hasData ? 'ready' : 'idle'

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Scan results
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {target ? (
                            <>
                                Aggregated network diagnostics for{' '}
                                <span className="font-mono text-xs">{target}</span>. Modules
                                will populate as they are wired to the backend.
                            </>
                        ) : (
                            'Aggregated network diagnostics. Start a scan from the home page to see results for a specific target.'
                        )}
                    </p>
                </div>
                <div className="text-xs text-muted-foreground">
                    Last updated:{' '}
                    <span className="font-mono">
            {hasData ? '— mock data' : '—'}
          </span>
                </div>
            </header>

            <section className="grid auto-rows-[1fr] gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DNSCard status={status} />
                <PingCard status={status} />
                <TracerouteCard status={status} />
                <TLSCard status={status} />
                <HttpCard status={status} />
                <MTUMSSCard status={status} />
                <DockerNetworkCard
                    status={status}
                    networks={dockerData.networks}
                    containers={dockerData.containers}
                    error={dockerData.error}
                    className="sm:col-span-2 xl:col-span-3"
                />
            </section>
        </div>
    )
}
