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

    const status: 'idle' | 'loading' | 'ready' =
        isLoading ? 'loading' : hasData ? 'ready' : 'idle'
    const showDashboard = status !== 'idle'

    const headingId = 'scan-results-heading'
    const descriptionId = 'scan-results-description'
    const statusId = 'scan-status-message'

    return (
        <main
            className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8"
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            aria-busy={status === 'loading'}
        >
            <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="space-y-1">
                    <h1
                        id={headingId}
                        className="text-2xl font-semibold tracking-tight"
                    >
                        Scan results
                    </h1>
                    <p
                        id={descriptionId}
                        className="text-sm text-muted-foreground"
                    >
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
                <div className="text-xs text-muted-foreground text-right">
                    <div aria-live="polite" id={statusId}>
                        Status:{' '}
                        <span className="font-mono">
                            {status === 'loading'
                                ? 'loading…'
                                : status === 'ready'
                                    ? 'ready (mock data)'
                                    : 'idle'}
                        </span>
                    </div>
                    <div>
                        Last updated:{' '}
                        <time className="font-mono" dateTime="0000-00-00T00:00:00Z">
                            {hasData ? '— mock data' : '—'}
                        </time>
                    </div>
                </div>
            </header>

            {showDashboard ? (
                <section
                    aria-label="Network diagnostics dashboard"
                    className="grid auto-rows-[1fr] gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
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
            ) : (
                <section
                    aria-label="Empty scan state"
                    className="rounded-md border bg-muted/40 px-4 py-6 text-sm text-muted-foreground"
                >
                    <p>
                        No active scan yet. Run a scan from the home page to populate the
                        dashboard.
                    </p>
                </section>
            )}
        </main>
    )
}
