'use client'

import { useEffect, useState } from 'react'
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
import { fetchDns, ApiError } from '@/lib/api/dns'
import type { DnsLookupResult } from '@/lib/types/dns'
import { fetchPing, PingApiError } from '@/lib/api/ping'
import type { PingResult } from '@/lib/types/ping'
import { fetchTraceroute, TracerouteApiError } from '@/lib/api/traceroute'
import type { TracerouteResult } from '@/lib/types/traceroute'
import { fetchTls, TlsApiError } from '@/lib/api/tls'
import type { TlsInspectorResult } from '@/lib/types/tls'

type ScanStatus = 'idle' | 'loading' | 'ready'

interface DockerNetworkSummary {
    networks: { name: string; driver?: string; subnet?: string }[]
    containers: { id: string; name: string; status: string; networks: string[] }[]
    error: string | null
}

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export default function ResultsPage() {
    const searchParams = useSearchParams()
    const rawTarget = searchParams.get('target')
    const target = rawTarget?.trim() ?? ''

    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle')
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)

    const [dnsResult, setDnsResult] = useState<DnsLookupResult | null>(null)
    const [dnsError, setDnsError] = useState<string | null>(null)

    const [pingResult, setPingResult] = useState<PingResult | null>(null)
    const [pingError, setPingError] = useState<string | null>(null)

    const [tracerouteResult, setTracerouteResult] =
        useState<TracerouteResult | null>(null)
    const [tracerouteError, setTracerouteError] = useState<string | null>(null)

    const [tlsResult, setTlsResult] = useState<TlsInspectorResult | null>(null)
    const [tlsError, setTlsError] = useState<string | null>(null)

    const [dockerData, setDockerData] = useState<DockerNetworkSummary | null>(
        null,
    )
    const [dockerError, setDockerError] = useState<string | null>(null)

    useEffect(() => {
        if (!target) {
            setScanStatus('idle')
            setDnsResult(null)
            setDnsError(null)
            setPingResult(null)
            setPingError(null)
            setTracerouteResult(null)
            setTracerouteError(null)
            setTlsResult(null)
            setTlsError(null)
            setDockerData(null)
            setDockerError(null)
            setLastUpdated(null)
            return
        }

        let cancelled = false
        setScanStatus('loading')
        setDnsError(null)
        setPingError(null)
        setTracerouteError(null)
        setTlsError(null)
        setDockerError(null)

        const dnsPromise = fetchDns(target)
            .then(res => {
                if (cancelled) return
                setDnsResult(res)
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof ApiError) {
                    setDnsError(err.message)
                } else {
                    setDnsError('DNS lookup failed')
                }
            })

        const pingPromise = fetchPing(target)
            .then(res => {
                if (cancelled) return
                setPingResult(res)
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof PingApiError) {
                    setPingError(err.message)
                } else {
                    setPingError('Ping failed')
                }
            })

        const traceroutePromise = fetchTraceroute(target)
            .then(res => {
                if (cancelled) return
                setTracerouteResult(res)
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof TracerouteApiError) {
                    setTracerouteError(err.message)
                } else {
                    setTracerouteError('Traceroute failed')
                }
            })

        const tlsPromise = fetchTls(target)
            .then(res => {
                if (cancelled) return
                setTlsResult(res)
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof TlsApiError) {
                    setTlsError(err.message)
                } else {
                    setTlsError('TLS inspection failed')
                }
            })

        const dockerPromise = fetch(`${defaultBaseUrl}/api/docker/network`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Docker network error: ${res.status}`)
                }
                return res.json()
            })
            .then((body: any) => {
                if (cancelled) return
                setDockerData({
                    networks: body.networks ?? [],
                    containers: body.containers ?? [],
                    error: body.error ?? null,
                })
            })
            .catch(err => {
                if (cancelled) return
                setDockerError(err.message ?? 'Docker network error')
                if (!dockerData) {
                    setDockerData({
                        networks: [],
                        containers: [],
                        error: err.message ?? 'Docker network error',
                    })
                }
            })

        Promise.allSettled([
            dnsPromise,
            pingPromise,
            traceroutePromise,
            tlsPromise,
            dockerPromise,
        ]).then(() => {
            if (cancelled) return
            setScanStatus('ready')
            setLastUpdated(new Date().toISOString())
        })

        return () => {
            cancelled = true
        }
    }, [target])

    const effectiveStatus: ScanStatus = target ? scanStatus : 'ready'
    const showDashboard = effectiveStatus !== 'idle'

    const headingId = 'scan-results-heading'
    const descriptionId = 'scan-results-description'
    const statusId = 'scan-status-message'

    const lastUpdatedDisplay = target
        ? lastUpdated
            ? new Date(lastUpdated).toLocaleString()
            : '—'
        : '— mock data'

    const lastUpdatedDateTime = lastUpdated ?? '0000-00-00T00:00:00Z'

    return (
        <main
            className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8"
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            aria-busy={effectiveStatus === 'loading'}
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

                <div className="text-right text-xs text-muted-foreground">
                    <div aria-live="polite" id={statusId}>
                        Status:{' '}
                        <span className="font-mono">
              {effectiveStatus === 'loading'
                  ? 'loading…'
                  : effectiveStatus === 'ready' && !target
                      ? 'ready (mock data)'
                      : 'ready'}
            </span>
                    </div>
                    <div>
                        Last updated:{' '}
                        <time className="font-mono" dateTime={lastUpdatedDateTime}>
                            {lastUpdatedDisplay}
                        </time>
                    </div>
                </div>
            </header>

            {target && (
                <section
                    aria-label="Live scan summary"
                    className="rounded-md border bg-muted/40 px-4 py-3 text-xs text-muted-foreground"
                >
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide">
                        Live summary
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <span className="font-mono">DNS</span>:{' '}
                            {dnsError ? (
                                <span className="text-destructive">error</span>
                            ) : dnsResult ? (
                                `${Object.keys(dnsResult.records ?? {}).length} record type(s)`
                            ) : (
                                'pending…'
                            )}
                        </div>
                        <div>
                            <span className="font-mono">Ping</span>:{' '}
                            {pingError ? (
                                <span className="text-destructive">error</span>
                            ) : pingResult ? (
                                (() => {
                                    const stats = pingResult as any
                                    const avg = typeof stats.avg === 'number' ? stats.avg : null
                                    const loss =
                                        typeof stats.packetLoss === 'number' ? stats.packetLoss : null
                                    if (avg == null && loss == null) return 'received'
                                    const parts: string[] = []
                                    if (avg != null) parts.push(`${avg.toFixed(1)} ms avg`)
                                    if (loss != null) parts.push(`${loss}% loss`)
                                    return parts.join(', ')
                                })()
                            ) : (
                                'pending…'
                            )}
                        </div>
                        <div>
                            <span className="font-mono">Traceroute</span>:{' '}
                            {tracerouteError ? (
                                <span className="text-destructive">error</span>
                            ) : tracerouteResult ? (
                                `${tracerouteResult.hops?.length ?? 0} hop(s)`
                            ) : (
                                'pending…'
                            )}
                        </div>
                        <div>
                            <span className="font-mono">TLS</span>:{' '}
                            {tlsError ? (
                                <span className="text-destructive">error</span>
                            ) : tlsResult ? (
                                (() => {
                                    const proto = tlsResult.protocol
                                    const cipher = tlsResult.cipherSuite
                                    if (!proto && !cipher) return 'inspected'
                                    if (proto && cipher) return `${proto}, ${cipher}`
                                    return proto ?? cipher ?? 'inspected'
                                })()
                            ) : (
                                'pending…'
                            )}
                        </div>
                        <div>
                            <span className="font-mono">Docker</span>:{' '}
                            {dockerError ? (
                                <span className="text-destructive">error</span>
                            ) : dockerData ? (
                                `${dockerData.networks.length} network(s), ${dockerData.containers.length} container(s)`
                            ) : (
                                'pending…'
                            )}
                        </div>
                    </div>
                </section>
            )}

            {showDashboard ? (
                <section
                    aria-label="Network diagnostics dashboard"
                    className="grid auto-rows-[1fr] gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                    <DNSCard
                        status={effectiveStatus}
                        dns={dnsResult}
                        error={dnsError}
                    />
                    <PingCard
                        status={effectiveStatus}
                        ping={pingResult}
                        error={pingError}
                    />
                    <TracerouteCard
                        status={effectiveStatus}
                        traceroute={tracerouteResult}
                        error={tracerouteError}
                    />
                    <TLSCard
                        status={effectiveStatus}
                        tls={tlsResult}
                        error={tlsError}
                    />
                    <HttpCard status={effectiveStatus} />
                    <MTUMSSCard status={effectiveStatus} />
                    <DockerNetworkCard
                        status={effectiveStatus}
                        networks={dockerData?.networks ?? []}
                        containers={dockerData?.containers ?? []}
                        error={dockerData?.error ?? dockerError ?? null}
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
