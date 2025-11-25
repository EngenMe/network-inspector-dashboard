import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { DnsLookupResult } from '@/lib/types/dns'
import type { PingResult } from '@/lib/types/ping'
import type { TracerouteResult } from '@/lib/types/traceroute'
import type { TlsInspectorResult } from '@/lib/types/tls'
import type { HttpInspectorResult } from '@/lib/types/http'

type Status = 'idle' | 'loading' | 'ready'

interface BaseCardProps {
    status: Status
    className?: string
}

// ───────────────────────── DNS ─────────────────────────

interface DNSCardProps extends BaseCardProps {
    dns?: DnsLookupResult | null
    error?: string | null
}

export function DNSCard({ status, dns, error, className }: DNSCardProps) {
    const records = dns?.records ?? {}
    const entries = Object.entries(records)
    const hasRecords = entries.length > 0

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>DNS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                    Inspect how the target resolves across A, AAAA, MX, CNAME, and NS.
                </p>

                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">Resolving DNS…</p>
                )}

                {error && status === 'ready' && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}

                {status === 'ready' && !error && !hasRecords && (
                    <p className="text-xs text-muted-foreground">
                        No DNS records returned for this target.
                    </p>
                )}

                {status === 'ready' && !error && hasRecords && (
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Record types
                        </p>
                        <ul className="space-y-1 text-xs">
                            {entries.map(([type, values]) => {
                                const count = Array.isArray(values) ? values.length : 0
                                return (
                                    <li
                                        key={type}
                                        className="flex items-center justify-between rounded border px-2 py-1"
                                    >
                    <span className="font-mono text-[11px] uppercase">
                      {type}
                    </span>
                                        <span className="font-mono text-[11px] text-muted-foreground">
                      {count} record{count !== 1 ? 's' : ''}
                    </span>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                            {records.a && Array.isArray(records.a) && records.a.length > 0 && (
                                <p>
                                    A →{' '}
                                    <span className="font-mono">
                    {String(records.a[0])}
                                        {records.a.length > 1 ? '…' : ''}
                  </span>
                                </p>
                            )}
                            {records.aaaa &&
                                Array.isArray(records.aaaa) &&
                                records.aaaa.length > 0 && (
                                    <p>
                                        AAAA →{' '}
                                        <span className="font-mono">
                      {String(records.aaaa[0])}
                                            {records.aaaa.length > 1 ? '…' : ''}
                    </span>
                                    </p>
                                )}
                            {records.mx &&
                                Array.isArray(records.mx) &&
                                records.mx.length > 0 && (
                                    <p>
                                        MX →{' '}
                                        <span className="font-mono">
                      {typeof records.mx[0] === 'object'
                          ? // @ts-expect-error loose shape from backend
                          records.mx[0].exchange ?? JSON.stringify(records.mx[0])
                          : String(records.mx[0])}
                                            {records.mx.length > 1 ? '…' : ''}
                    </span>
                                    </p>
                                )}
                        </div>

                        <p className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                            LIVE · DNS data from backend resolver
                        </p>
                    </div>
                )}

                {status !== 'ready' && !hasRecords && !error && (
                    <p className="text-[11px] text-muted-foreground">
                        DNS module will populate once the backend finishes the first lookup.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ───────────────────────── Ping ─────────────────────────

interface PingCardProps extends BaseCardProps {
    ping?: PingResult | null
    error?: string | null
}

export function PingCard({ status, ping, error, className }: PingCardProps) {
    const stats = ping?.stats ?? (ping as any) ?? {}
    const avg =
        typeof stats?.avgRttMs === 'number'
            ? stats.avgRttMs
            : typeof stats?.avg === 'number'
                ? stats.avg
                : undefined
    const loss =
        typeof stats?.packetLoss === 'number'
            ? stats.packetLoss
            : typeof stats?.loss === 'number'
                ? stats.loss
                : undefined

    const transmitted = stats?.transmitted ?? stats?.packetsTransmitted
    const received = stats?.received ?? stats?.packetsReceived

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Ping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                    Ping latency and packet loss timelines will be displayed here.
                </p>

                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">
                        Collecting ICMP statistics…
                    </p>
                )}

                {status === 'ready' && error && !ping && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}

                {status === 'ready' && ping && (
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded border px-2 py-1">
                            <span className="font-mono text-[11px] uppercase">Latency</span>
                            <span className="font-mono">
                {typeof avg === 'number'
                    ? `${avg.toFixed(1)} ms avg`
                    : 'n/a'}
              </span>
                        </div>
                        <div className="flex items-center justify-between rounded border px-2 py-1">
                            <span className="font-mono text-[11px] uppercase">Packet loss</span>
                            <span className="font-mono">
                {typeof loss === 'number' ? `${loss}%` : 'n/a'}
              </span>
                        </div>
                        {(transmitted != null || received != null) && (
                            <p className="text-[11px] text-muted-foreground">
                                {transmitted != null && received != null
                                    ? `${transmitted} sent · ${received} received`
                                    : null}
                            </p>
                        )}
                        <p className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                            LIVE · ICMP echo data from backend
                        </p>
                    </div>
                )}

                {status === 'ready' && !ping && !error && (
                    <p className="text-xs text-muted-foreground">
                        No ping data available yet. Trigger a scan to populate this card.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ─────────────────────── Traceroute ───────────────────────

interface TracerouteCardProps extends BaseCardProps {
    traceroute?: TracerouteResult | null
    error?: string | null
}

export function TracerouteCard({
                                   status,
                                   traceroute,
                                   error,
                                   className,
                               }: TracerouteCardProps) {
    const hops = traceroute?.hops ?? []

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Traceroute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                    Hop-by-hop route visualizations will be rendered in this card.
                </p>

                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">
                        Probing hops towards the destination…
                    </p>
                )}

                {status === 'ready' && error && !traceroute && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}

                {status === 'ready' && traceroute && hops.length > 0 && (
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Path overview
              </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                {hops.length} hop{hops.length !== 1 ? 's' : ''}
              </span>
                        </div>
                        <div className="max-h-40 overflow-auto rounded border">
                            <ol className="divide-y">
                                {hops.slice(0, 12).map(hop => {
                                    const rtts = hop.rttMs ?? []
                                    const min =
                                        rtts.length > 0
                                            ? Math.min(...rtts)
                                            : null
                                    const max =
                                        rtts.length > 0
                                            ? Math.max(...rtts)
                                            : null

                                    return (
                                        <li
                                            key={hop.hop}
                                            className="flex items-center gap-2 px-2 py-1.5"
                                        >
                      <span className="w-7 shrink-0 text-[11px] font-mono text-muted-foreground">
                        {hop.hop}
                      </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1">
                          <span className="truncate font-mono">
                            {hop.host ?? hop.ip ?? '*'}
                          </span>
                                                    {hop.ip && hop.host && (
                                                        <span className="text-[10px] text-muted-foreground">
                              ({hop.ip})
                            </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {min != null && max != null
                                                        ? `${min.toFixed(1)}–${max.toFixed(1)} ms`
                                                        : 'no RTT data'}
                                                    {typeof hop.loss === 'number'
                                                        ? ` · ${hop.loss}% loss`
                                                        : ''}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                        <p className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                            LIVE · hop-by-hop path from backend traceroute
                        </p>
                    </div>
                )}

                {status === 'ready' && (!traceroute || hops.length === 0) && !error && (
                    <p className="text-xs text-muted-foreground">
                        No traceroute data yet. It will appear once the traceroute module is
                        wired.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ───────────────────────── TLS ─────────────────────────

interface TLSCardProps extends BaseCardProps {
    tls?: TlsInspectorResult | null
    error?: string | null
}

export function TLSCard({ status, tls, error, className }: TLSCardProps) {
    const now = Date.now()
    const notBefore = tls?.validFrom ? Date.parse(tls.validFrom) : NaN
    const notAfter = tls?.validTo ? Date.parse(tls.validTo) : NaN

    const isValidWindow =
        Number.isFinite(notBefore) && Number.isFinite(notAfter) && notBefore < notAfter

    const isCurrentlyValid =
        isValidWindow && now >= notBefore && now <= notAfter

    const validityLabel = (() => {
        if (!isValidWindow) return null
        if (isCurrentlyValid) return 'Valid'
        if (now < notBefore) return 'Not yet valid'
        return 'Expired'
    })()

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>TLS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                    Certificate chain, protocol version, and cipher suite details will
                    show here.
                </p>

                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">
                        Inspecting TLS handshake and certificate…
                    </p>
                )}

                {status === 'ready' && error && !tls && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}

                {status === 'ready' && tls && (
                    <div className="space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5">
                                <p className="font-mono text-[11px]">
                                    {tls.domain ?? tls.subject ?? 'TLS endpoint'}
                                </p>
                                {tls.resolvedIp && (
                                    <p className="text-[11px] text-muted-foreground">
                                        {tls.resolvedIp}
                                    </p>
                                )}
                            </div>
                            <div className="text-right text-[10px] text-muted-foreground">
                                {tls.protocol && (
                                    <div>
                                        Proto:{' '}
                                        <span className="font-mono">{tls.protocol}</span>
                                    </div>
                                )}
                                {tls.cipherSuite && (
                                    <div>
                                        Cipher:{' '}
                                        <span className="font-mono">{tls.cipherSuite}</span>
                                    </div>
                                )}
                                {tls.alpn && (
                                    <div>
                                        ALPN:{' '}
                                        <span className="font-mono">{tls.alpn}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(tls.subject || tls.issuer) && (
                            <div className="rounded border bg-muted/40 p-2">
                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Certificate
                                </p>
                                {tls.subject && (
                                    <p className="text-[11px]">
                                        Subject:{' '}
                                        <span className="font-mono break-all">
                      {tls.subject}
                    </span>
                                    </p>
                                )}
                                {tls.issuer && (
                                    <p className="text-[11px]">
                                        Issuer:{' '}
                                        <span className="font-mono break-all">
                      {tls.issuer}
                    </span>
                                    </p>
                                )}
                            </div>
                        )}

                        {(tls.validFrom || tls.validTo) && (
                            <div className="flex items-center justify-between gap-2 rounded border bg-muted/40 px-2 py-1.5">
                                <div className="space-y-0.5">
                                    {tls.validFrom && (
                                        <p className="text-[11px] text-muted-foreground">
                                            Not before:{' '}
                                            <time dateTime={tls.validFrom} className="font-mono">
                                                {new Date(tls.validFrom).toLocaleDateString()}
                                            </time>
                                        </p>
                                    )}
                                    {tls.validTo && (
                                        <p className="text-[11px] text-muted-foreground">
                                            Not after:{' '}
                                            <time dateTime={tls.validTo} className="font-mono">
                                                {new Date(tls.validTo).toLocaleDateString()}
                                            </time>
                                        </p>
                                    )}
                                </div>
                                {validityLabel && (
                                    <span
                                        className={
                                            isCurrentlyValid
                                                ? 'rounded bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-500'
                                                : 'rounded bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase text-amber-500'
                                        }
                                    >
                    {validityLabel}
                  </span>
                                )}
                            </div>
                        )}

                        {tls.san && tls.san.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Subject Alternative Names
                                </p>
                                <div className="max-h-20 overflow-auto rounded border px-2 py-1.5">
                                    <ul className="space-y-0.5">
                                        {tls.san.slice(0, 10).map((name, i) => (
                                            <li
                                                key={`${name}-${i}`}
                                                className="font-mono text-[11px]"
                                            >
                                                {name}
                                            </li>
                                        ))}
                                        {tls.san.length > 10 && (
                                            <li className="text-[10px] text-muted-foreground">
                                                + {tls.san.length - 10} more…
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <p className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                            LIVE · TLS handshake and certificate from backend inspector
                        </p>
                    </div>
                )}

                {status === 'ready' && !tls && !error && (
                    <p className="text-xs text-muted-foreground">
                        TLS details will appear here after the TLS inspector is connected.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ───────────────────────── HTTP ─────────────────────────

interface HttpCardProps extends BaseCardProps {
    http?: HttpInspectorResult | null
    error?: string | null
}

export function HttpCard({ status, http, error, className }: HttpCardProps) {
    const rawHeaders = (http as any)?.headers ?? []
    const headers =
        Array.isArray(rawHeaders)
            ? rawHeaders
            : rawHeaders && typeof rawHeaders === 'object'
                ? Object.entries(rawHeaders).map(([name, value]) => ({
                    name,
                    value: String(value),
                }))
                : []

    const redirects = Array.isArray(http?.redirectChain)
        ? http!.redirectChain!
        : []

    const hasRedirects = redirects.length > 0

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>HTTP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                    HTTP status, response headers, and protocol information will be
                    displayed here.
                </p>

                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">
                        Performing HTTP request and capturing response…
                    </p>
                )}

                {status === 'ready' && error && !http && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}

                {status === 'ready' && http && (
                    <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 space-y-0.5">
                                <p className="truncate font-mono">
                                    {http.method} {http.url}
                                </p>
                                {http.ip && (
                                    <p className="text-[11px] text-muted-foreground">
                                        {http.ip}
                                    </p>
                                )}
                            </div>
                            <div className="text-right text-[11px]">
                                <p className="font-mono">
                                    {http.statusCode} {http.statusText ?? ''}
                                </p>
                                {http.protocol && (
                                    <p className="text-muted-foreground">{http.protocol}</p>
                                )}
                                {http.contentType && (
                                    <p className="text-muted-foreground">
                                        {http.contentType}
                                    </p>
                                )}
                            </div>
                        </div>

                        {hasRedirects && (
                            <div className="rounded border bg-muted/40 p-2">
                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Redirect chain
                                </p>
                                <ol className="space-y-0.5">
                                    {redirects.map((r, i) => (
                                        <li
                                            key={`${r.statusCode}-${r.url}-${i}`}
                                            className="flex items-center justify-between gap-2"
                                        >
                      <span className="font-mono text-[11px]">
                        {r.statusCode}
                      </span>
                                            <span className="truncate font-mono text-[11px]">
                        {r.url}
                      </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Headers
                            </p>
                            {headers.length === 0 ? (
                                <p className="text-[11px] text-muted-foreground">
                                    No headers captured.
                                </p>
                            ) : (
                                <div className="max-h-40 overflow-auto rounded border">
                                    <ul className="divide-y">
                                        {headers.map((h, i) => (
                                            <li
                                                key={`${h.name}-${i}`}
                                                className="flex items-center gap-2 px-2 py-1.5"
                                            >
                        <span className="w-28 shrink-0 truncate font-mono text-[11px] text-muted-foreground">
                          {h.name}
                        </span>
                                                <span className="min-w-0 flex-1 truncate font-mono text-[11px]">
                          {h.value}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <p className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                            LIVE · HTTP response from backend inspector
                        </p>
                    </div>
                )}

                {status === 'ready' && !http && !error && (
                    <p className="text-xs text-muted-foreground">
                        HTTP inspector is not wired yet. Results will show here after
                        integration.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ─────────────────────── MTU / MSS ───────────────────────

export function MTUMSSCard({ status, className }: BaseCardProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>MTU / MSS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p className="text-xs text-muted-foreground">
                    MTU and MSS behavior across the path will be summarized here.
                </p>
                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">
                        Probing path MTU and MSS…
                    </p>
                )}
                {status === 'ready' && (
                    <p className="text-xs text-muted-foreground">
                        MTU / MSS tests are not connected yet. They will populate this card
                        later.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ───────────────────── Docker Network Map ─────────────────────

interface DockerNetworkCardProps extends BaseCardProps {
    networks: { name: string; driver?: string; subnet?: string }[]
    containers: { id: string; name: string; status: string; networks: string[] }[]
    error?: string | null
}

export function DockerNetworkCard({
                                      status,
                                      networks,
                                      containers,
                                      error,
                                      className,
                                  }: DockerNetworkCardProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Docker Network Map</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                    Docker container networks and bridges will be visualized here.
                </p>

                {status === 'loading' && (
                    <p className="text-xs text-muted-foreground">
                        Inspecting Docker networks and containers…
                    </p>
                )}

                {error && status === 'ready' && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}

                {status === 'ready' && !error && networks.length === 0 && containers.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                        No Docker networks or containers found in the current environment.
                    </p>
                )}

                {status === 'ready' && !error && (networks.length > 0 || containers.length > 0) && (
                    <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Topology
                        </p>
                        <div className="space-y-2 text-xs">
                            {networks.map(net => (
                                <div
                                    key={net.name}
                                    className="rounded border px-2 py-1.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px]">
                      {net.name}
                    </span>
                                        <span className="text-[10px] font-mono text-muted-foreground">
                      {net.driver ?? 'bridge'} · {net.subnet ?? 'unknown subnet'}
                    </span>
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {containers
                                            .filter(c => c.networks?.includes(net.name))
                                            .map(c => (
                                                <span
                                                    key={c.id}
                                                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono"
                                                >
                          {c.name}{' '}
                                                    <span className="text-[9px] uppercase text-muted-foreground">
                            {c.status}
                          </span>
                        </span>
                                            ))}
                                        {containers.filter(c => c.networks?.includes(net.name)).length === 0 && (
                                            <span className="text-[10px] text-muted-foreground">
                        No containers on this network.
                      </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
