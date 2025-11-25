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
import { fetchHttpInfo, HttpApiError } from '@/lib/api/http'
import type { HttpInspectorResult } from '@/lib/types/http'
import { fetchMtu, MtuApiError } from '@/lib/api/mtu'
import type { MtuResult } from '@/lib/types/mtu'

type ScanStatus = 'idle' | 'loading' | 'ready'

interface DockerNetworkSummary {
    networks: { name: string; driver?: string; subnet?: string }[]
    containers: { id: string; name: string; status: string; networks: string[] }[]
    error: string | null
}

interface DockerTopologyNode {
    id: string
    name?: string
    type: string
}

interface DockerTopologyLink {
    sourceId: string
    targetId: string
}

interface DockerTopologyPayload {
    nodes?: DockerTopologyNode[]
    links?: DockerTopologyLink[]
    error?: string | null
}

interface PingStats {
    avg?: number
    packetLoss?: number
}

function mapDockerTopology(body?: DockerTopologyPayload | null): DockerNetworkSummary {
    const nodes: DockerTopologyNode[] = Array.isArray(body?.nodes)
        ? (body?.nodes as DockerTopologyNode[])
        : []

    const links: DockerTopologyLink[] = Array.isArray(body?.links)
        ? (body?.links as DockerTopologyLink[])
        : []

    const networkNodes = nodes.filter(n => n && n.type === 'network')
    const containerNodes = nodes.filter(n => n && n.type === 'container')

    const networks = networkNodes.map(n => ({
        name: String(n.name ?? n.id ?? 'unknown'),
        driver: 'bridge',
        subnet: undefined,
    }))

    const containers = containerNodes.map(c => {
        const attachedLinks = links.filter(l => l && l.sourceId === c.id)
        const attachedNetworkNames = attachedLinks
            .map(l => {
                const net = networkNodes.find(n => n.id === l.targetId)
                return net?.name ?? l.targetId
            })
            .filter(Boolean) as string[]

        return {
            id: String(c.id ?? c.name ?? 'unknown'),
            name: String(c.name ?? c.id ?? 'container'),
            status: 'attached',
            networks: attachedNetworkNames,
        }
    })

    return {
        networks,
        containers,
        error: body?.error ?? null,
    }
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

    const [httpResult, setHttpResult] = useState<HttpInspectorResult | null>(null)
    const [httpError, setHttpError] = useState<string | null>(null)

    const [mtuResult, setMtuResult] = useState<MtuResult | null>(null)
    const [mtuError, setMtuError] = useState<string | null>(null)

    const [dockerData, setDockerData] = useState<DockerNetworkSummary | null>(null)
    const [dockerError, setDockerError] = useState<string | null>(null)

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!target) {
            return
        }

        let cancelled = false

        setScanStatus('loading')
        setDnsError(null)
        setPingError(null)
        setTracerouteError(null)
        setTlsError(null)
        setHttpError(null)
        setMtuError(null)
        setDockerError(null)

        const markUpdated = () => {
            if (!cancelled) {
                setLastUpdated(new Date().toISOString())
            }
        }

        const dnsPromise = fetchDns(target)
            .then(res => {
                if (cancelled) return
                setDnsResult(res)
                markUpdated()
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof ApiError) {
                    setDnsError(err.message)
                } else {
                    setDnsError('DNS lookup failed')
                }
                markUpdated()
            })

        const pingPromise = fetchPing(target)
            .then(res => {
                if (cancelled) return
                setPingResult(res)
                markUpdated()
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof PingApiError) {
                    setPingError(err.message)
                } else {
                    setPingError('Ping failed')
                }
                markUpdated()
            })

        const traceroutePromise = fetchTraceroute(target)
            .then(res => {
                if (cancelled) return
                setTracerouteResult(res)
                markUpdated()
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof TracerouteApiError) {
                    setTracerouteError(err.message)
                } else {
                    setTracerouteError('Traceroute failed')
                }
                markUpdated()
            })

        const tlsPromise = fetchTls(target)
            .then(res => {
                if (cancelled) return
                setTlsResult(res)
                markUpdated()
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof TlsApiError) {
                    setTlsError(err.message)
                } else {
                    setTlsError('TLS inspection failed')
                }
                markUpdated()
            })

        const httpPromise = fetchHttpInfo(
            target.startsWith('http') ? target : `https://${target}`,
        )
            .then(res => {
                if (cancelled) return
                setHttpResult(res)
                markUpdated()
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof HttpApiError) {
                    setHttpError(err.message)
                } else {
                    setHttpError('HTTP inspection failed')
                }
                markUpdated()
            })

        const mtuPromise = fetchMtu(target)
            .then(res => {
                if (cancelled) return
                setMtuResult(res)
                markUpdated()
            })
            .catch(err => {
                if (cancelled) return
                if (err instanceof MtuApiError) {
                    setMtuError(err.message)
                } else {
                    setMtuError('MTU/MSS test failed')
                }
                markUpdated()
            })

        const dockerPromise = fetch(`${defaultBaseUrl}/api/docker/network`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Docker network error: ${res.status}`)
                }
                return res.json() as Promise<DockerTopologyPayload>
            })
            .then(body => {
                if (cancelled) return
                const summary = mapDockerTopology(body)
                setDockerData(summary)
            })
            .catch(err => {
                if (cancelled) return
                const message =
                    err instanceof Error ? err.message : 'Docker network error'
                setDockerError(message)
                setDockerData(prev =>
                        prev ?? {
                            networks: [],
                            containers: [],
                            error: message,
                        },
                )
            })

        // Global status is only about "all modules finished"
        Promise.allSettled([
            dnsPromise,
            pingPromise,
            traceroutePromise,
            tlsPromise,
            httpPromise,
            mtuPromise,
            dockerPromise,
        ]).then(() => {
            if (cancelled) return
            setScanStatus('ready')
        })

        return () => {
            cancelled = true
        }
    }, [target])

    // Per-module status: as soon as that module has data OR error, it's "ready"
    const moduleStatus = (
        result: unknown | null,
        error: string | null,
    ): ScanStatus => {
        if (!target) return 'idle'
        if (result || error) return 'ready'
        return scanStatus
    }

    const dnsStatus = moduleStatus(target ? dnsResult : null, target ? dnsError : null)
    const pingStatus = moduleStatus(target ? pingResult : null, target ? pingError : null)
    const tracerouteStatus = moduleStatus(
        target ? tracerouteResult : null,
        target ? tracerouteError : null,
    )
    const tlsStatus = moduleStatus(target ? tlsResult : null, target ? tlsError : null)
    const httpStatus = moduleStatus(target ? httpResult : null, target ? httpError : null)
    const mtuStatus = moduleStatus(target ? mtuResult : null, target ? mtuError : null)
    const dockerStatus = moduleStatus(
        target ? dockerData : null,
        target ? dockerError : null,
    )

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
                                resolve independently as they complete.
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
                                    const stats = pingResult as PingStats
                                    const avg = typeof stats.avg === 'number' ? stats.avg : null
                                    const loss =
                                        typeof stats.packetLoss === 'number'
                                            ? stats.packetLoss
                                            : null
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
                            <span className="font-mono">HTTP</span>:{' '}
                            {httpError ? (
                                <span className="text-destructive">error</span>
                            ) : httpResult ? (
                                `${httpResult.statusCode} ${httpResult.statusText ?? ''}`.trim()
                            ) : (
                                'pending…'
                            )}
                        </div>
                        <div>
                            <span className="font-mono">MTU/MSS</span>:{' '}
                            {mtuError ? (
                                <span className="text-destructive">error</span>
                            ) : mtuResult ? (
                                (() => {
                                    const mtu = mtuResult.mtu
                                    const mss = mtuResult.mss
                                    if (mtu == null && mss == null) return 'measured'
                                    const parts: string[] = []
                                    if (mtu != null) parts.push(`MTU ${mtu}`)
                                    if (mss != null) parts.push(`MSS ${mss}`)
                                    return parts.join(', ')
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
                    <DNSCard status={dnsStatus} dns={target ? dnsResult : null} error={target ? dnsError : null} />
                    <PingCard status={pingStatus} ping={target ? pingResult : null} error={target ? pingError : null} />
                    <TracerouteCard
                        status={tracerouteStatus}
                        traceroute={target ? tracerouteResult : null}
                        error={target ? tracerouteError : null}
                    />
                    <TLSCard status={tlsStatus} tls={target ? tlsResult : null} error={target ? tlsError : null} />
                    <HttpCard status={httpStatus} http={target ? httpResult : null} error={target ? httpError : null} />
                    <MTUMSSCard status={mtuStatus} mtu={target ? mtuResult : null} error={target ? mtuError : null} />
                    <DockerNetworkCard
                        status={dockerStatus}
                        networks={target && dockerData ? dockerData.networks : []}
                        containers={target && dockerData ? dockerData.containers : []}
                        error={target ? dockerData?.error ?? dockerError ?? null : null}
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
