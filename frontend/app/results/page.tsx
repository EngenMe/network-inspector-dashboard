'use client'

import { useSearchParams } from 'next/navigation'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'

export default function ResultsPage() {
    const searchParams = useSearchParams()
    const rawTarget = searchParams.get('target')
    const target = rawTarget?.trim() ?? ''

    const isLoading = false
    const hasData = false

    const cards = [
        {
            key: 'dns',
            title: 'DNS',
            desc: 'DNS summary card will appear here once results are shared from the DNS module.',
        },
        {
            key: 'ping',
            title: 'Ping',
            desc: 'Ping latency and packet loss graphs will be added here.',
        },
        {
            key: 'traceroute',
            title: 'Traceroute',
            desc: 'Hop-by-hop route visualization will be rendered in this card.',
        },
        {
            key: 'tls',
            title: 'TLS',
            desc: 'Certificate chain and cipher details will be shown here.',
        },
        {
            key: 'http',
            title: 'HTTP',
            desc: 'HTTP status, headers, and protocol information will be displayed here.',
        },
        {
            key: 'mtu',
            title: 'MTU / MSS',
            desc: 'MTU and MSS behaviors will be summarized here after implementation.',
        },
        {
            key: 'docker',
            title: 'Docker Network Map',
            desc: 'Docker container networks and bridges will be visualized here.',
            full: true,
        },
    ]

    return (
        <main className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-6 px-4 py-10">
            <header className="space-y-2">
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
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cards.map(card => (
                    <Card
                        key={card.key}
                        className={card.full ? 'md:col-span-2 xl:col-span-3' : ''}
                    >
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>{card.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                {isLoading
                                    ? `Loading ${card.title} data…`
                                    : hasData
                                        ? `${card.title} data ready – integration coming in later steps.`
                                        : 'No data yet – module not wired.'}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    )
}
