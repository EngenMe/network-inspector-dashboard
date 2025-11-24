'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe2, Loader2, SlidersHorizontal, Code2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DnsCard } from '@/components/dns/dns-card'
import { fetchDns, ApiError } from '@/lib/api/dns'
import type { DnsLookupResult, DnsRecordType } from '@/lib/types/dns'

const allRecordTypes: DnsRecordType[] = ['A', 'AAAA', 'MX', 'CNAME', 'NS', 'SOA', 'TXT']

export default function Page() {
    const router = useRouter()

    const [domain, setDomain] = useState('')
    const [selectedTypes, setSelectedTypes] = useState<DnsRecordType[]>([])
    const [result, setResult] = useState<DnsLookupResult | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showJson, setShowJson] = useState(false)

    const requestIdRef = useRef(0)

    const toggleType = (type: DnsRecordType) => {
        setSelectedTypes(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type)
            }
            return [...prev, type]
        })
    }

    const applyPreset = (value: string) => {
        setDomain(value)
        setError(null)
    }

    const runScan = async () => {
        const trimmed = domain.trim()
        if (!trimmed) {
            setError('Please enter a domain to scan.')
            setResult(undefined)
            return
        }

        const currentRequestId = ++requestIdRef.current
        setIsLoading(true)
        setError(null)

        try {
            const data = await fetchDns(trimmed, {
                types: selectedTypes.length ? selectedTypes : undefined,
            })

            if (currentRequestId !== requestIdRef.current) return

            setResult(data)
        } catch (err) {
            if (currentRequestId !== requestIdRef.current) return

            if (err instanceof ApiError) {
                setError(err.message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Unexpected error while running DNS lookup.')
            }
            setResult(undefined)
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setIsLoading(false)
            }
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        runScan()
    }

    const handleRetry = () => {
        runScan()
    }

    const handleScanAllModules = () => {
        const trimmed = domain.trim()
        if (!trimmed) {
            setError('Please enter a domain to scan.')
            return
        }

        router.push(`/results?target=${encodeURIComponent(trimmed)}`)
    }

    const hasSelection = selectedTypes.length > 0
    const trimmedDomain = domain.trim()

    return (
        <main className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-6 px-4 py-10 animate-fadeBlurIn">
            <header className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                    <Globe2 className="h-3.5 w-3.5" />
                    <span>Network Inspector • DNS Lookup</span>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Resolve domains like a network engineer
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Inspect DNS records, focus specific record types, and peek at the raw API payload
                            used by the backend network toolkit.
                        </p>
                    </div>
                    {result && (
                        <div className="flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>Last scan: {result.domain}</span>
                        </div>
                    )}
                </div>
            </header>

            <section className="space-y-4 rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 md:flex-row md:items-end"
                >
                    <div className="flex-1 space-y-2">
                        <label
                            className="flex items-center gap-2 text-sm font-medium"
                            htmlFor="domain-input"
                        >
                            <Globe2 className="h-4 w-4 text-muted-foreground" />
                            <span>Domain or hostname</span>
                        </label>
                        <div className="relative">
                            <input
                                id="domain-input"
                                value={domain}
                                onChange={event => setDomain(event.target.value)}
                                placeholder="example.com"
                                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            {trimmedDomain && (
                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-muted-foreground">
                  DNS
                </span>
                            )}
                        </div>
                        {error && (
                            <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 md:w-auto">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                type="submit"
                                disabled={isLoading || !trimmedDomain}
                                className="w-full sm:w-32"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Scanning…
                                    </>
                                ) : (
                                    'Run lookup'
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={!trimmedDomain}
                                onClick={handleScanAllModules}
                                className="w-full sm:w-40"
                            >
                                Scan all modules
                            </Button>
                        </div>

                        <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                            <span>Quick targets:</span>
                            <button
                                type="button"
                                onClick={() => applyPreset('google.com')}
                                className="rounded-full border px-2 py-0.5 hover:bg-muted"
                            >
                                google.com
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('cloudflare.com')}
                                className="rounded-full border px-2 py-0.5 hover:bg-muted"
                            >
                                cloudflare.com
                            </button>
                        </div>
                    </div>
                </form>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            <span>Record types</span>
                            {!hasSelection && (
                                <Badge variant="outline" className="text-[10px]">
                                    All by default
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {allRecordTypes.map(type => {
                                const selected = selectedTypes.includes(type)
                                const active = selected || !hasSelection
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleType(type)}
                                        className={`group inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                                            active
                                                ? 'border-primary/80 bg-primary text-primary-foreground shadow-sm'
                                                : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <span>{type}</span>
                                        {selected && (
                                            <span className="text-[9px] uppercase opacity-80 group-hover:opacity-100">
                        selected
                      </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                        <Code2 className="h-3.5 w-3.5" />
                        <span>Show raw JSON response</span>
                        <input
                            type="checkbox"
                            checked={showJson}
                            onChange={event => setShowJson(event.target.checked)}
                            className="h-3 w-3 accent-primary"
                        />
                    </label>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                <div className="animate-slideInRight">
                    <DnsCard
                        domain={trimmedDomain || result?.domain || ''}
                        result={result}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                    />
                </div>

                <div className="space-y-2 animate-slideOutLeft md:animate-none">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">DNS result payload</h2>
                        <Badge
                            variant={result ? 'default' : 'outline'}
                            className="text-[10px] uppercase tracking-wide"
                        >
                            {result ? 'Ready' : 'Waiting'}
                        </Badge>
                    </div>
                    {showJson ? (
                        result ? (
                            <ScrollArea className="h-64 rounded-2xl border bg-card/80 p-2 text-xs">
                <pre className="font-mono text-[11px] leading-relaxed">
                  {JSON.stringify(result, null, 2)}
                </pre>
                            </ScrollArea>
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed bg-card/70 text-xs text-muted-foreground">
                                Run a lookup to inspect the JSON response.
                            </div>
                        )
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-card/70 text-xs text-muted-foreground">
                            <Code2 className="h-4 w-4" />
                            <p>Enable “Show raw JSON response” to see the backend payload.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
