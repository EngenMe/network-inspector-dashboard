'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchDns, ApiError } from '@/lib/api/dns'
import type { DnsLookupResult } from '@/lib/types/dns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

type DnsRecordObject = {
    exchange?: string
    host?: string
    name?: string
    priority?: number
    [key: string]: unknown
}

type DnsRecordItem = string | DnsRecordObject


export default function DnsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const domain = searchParams.get('domain') ?? ''

    const [data, setData] = useState<DnsLookupResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string>('all')
    const [filter, setFilter] = useState('')

    useEffect(() => {
        if (!domain) return

        const controller = new AbortController()
        setIsLoading(true)
        setShowSkeleton(true)
        setError(null)

        fetchDns(domain, { signal: controller.signal })
            .then(res => {
                setData(res)
                const types = Object.keys(res.records ?? {})
                if (types.length && !types.includes(selectedType)) {
                    setSelectedType('all')
                }
            })
            .catch(err => {
                if (err instanceof ApiError) {
                    setError(err.message)
                } else if (!(err instanceof DOMException && err.name === 'AbortError')) {
                    setError('DNS lookup failed')
                }
            })
            .finally(() => {
                setIsLoading(false)
            })

        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [domain])

    // Keep skeleton visible for a bit after loading finishes
    useEffect(() => {
        if (isLoading) return
        const timeout = setTimeout(() => {
            setShowSkeleton(false)
        }, 1200) // 1.2s grace time after load
        return () => clearTimeout(timeout)
    }, [isLoading])

    const entries = useMemo(
        () => (data ? Object.entries(data.records ?? {}) : []),
        [data],
    )

    const totalRecords = useMemo(
        () =>
            entries.reduce((sum, [, values]) => {
                if (Array.isArray(values)) return sum + values.length
                return sum
            }, 0),
        [entries],
    )

    const visibleEntries = useMemo(
        () =>
            entries.filter(([type]) =>
                selectedType === 'all' ? true : type === selectedType,
            ),
        [entries, selectedType],
    )

    if (!domain) {
        return (
            <main
                className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 py-8"
                aria-labelledby="dns-page-title"
            >
                <header>
                    <h1 id="dns-page-title" className="text-2xl font-semibold">
                        DNS Inspector
                    </h1>
                </header>
                <p className="text-sm text-muted-foreground">
                    No domain provided. Go back to the home page to start a lookup.
                </p>
                <Button asChild>
                    <Link href="/">Back to home</Link>
                </Button>
            </main>
        )
    }

    return (
        <main
            className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8"
            aria-labelledby="dns-page-title"
        >
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1
                        id="dns-page-title"
                        className="text-2xl font-semibold tracking-tight"
                    >
                        DNS Inspector
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Resolved records for{' '}
                        <code className="font-mono text-xs">{domain}</code>
                    </p>
                    {data?.resolvedAt && (
                        <dl className="text-xs text-muted-foreground">
                            <div className="flex gap-1">
                                <dt className="font-medium">Resolved at</dt>
                                <dd>
                                    <time dateTime={data.resolvedAt}>
                                        {new Date(data.resolvedAt).toLocaleString()}
                                    </time>
                                </dd>
                            </div>
                        </dl>
                    )}
                </div>

                <nav
                    aria-label="DNS actions"
                    className="flex flex-wrap items-center gap-2"
                >
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push('/')}
                    >
                        New lookup
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            router.push(`/results?target=${encodeURIComponent(domain)}`)
                        }
                    >
                        View results
                    </Button>
                    <Badge
                        variant="outline"
                        className="text-[11px] font-mono uppercase"
                        aria-label={`${totalRecords} DNS records found`}
                    >
                        {totalRecords} records
                    </Badge>
                </nav>
            </header>

            <section aria-label="DNS results view" className="w-full">
                <Tabs defaultValue="records" className="w-full">
                    <TabsList aria-label="DNS result format">
                        <TabsTrigger value="records">Records</TabsTrigger>
                        <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                    </TabsList>

                    <TabsContent value="records" className="mt-4 space-y-4">
                        <section aria-label="DNS record list">
                            <Card>
                                <CardHeader className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <CardTitle>
                                            <h2 className="text-base font-medium">DNS records</h2>
                                        </CardTitle>
                                        <div
                                            className="flex flex-wrap gap-2"
                                            aria-label="Filter by record type"
                                        >
                                            <Badge
                                                role="button"
                                                aria-pressed={selectedType === 'all'}
                                                variant={selectedType === 'all' ? 'default' : 'outline'}
                                                className="cursor-pointer text-[11px] font-mono"
                                                onClick={() => setSelectedType('all')}
                                            >
                                                All
                                            </Badge>
                                            {entries.map(([type, values]) => {
                                                const count = Array.isArray(values) ? values.length : 0
                                                return (
                                                    <Badge
                                                        key={type}
                                                        role="button"
                                                        aria-pressed={selectedType === type}
                                                        variant={
                                                            selectedType === type ? 'default' : 'outline'
                                                        }
                                                        className="cursor-pointer text-[11px] font-mono"
                                                        onClick={() => setSelectedType(type)}
                                                    >
                                                        {type.toUpperCase()} · {count}
                                                    </Badge>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <p className="text-xs text-muted-foreground">
                                            Filter by record type or search across hosts, IPs, and
                                            exchanges.
                                        </p>
                                        <Input
                                            aria-label="Filter DNS record values"
                                            placeholder="Filter values (e.g. 209.85 or smtp)"
                                            value={filter}
                                            onChange={e => setFilter(e.target.value)}
                                            className="h-8 text-xs sm:w-64"
                                        />
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 text-xs">
                                    {showSkeleton && (
                                        <div className="space-y-3" aria-hidden="true">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                                <Skeleton className="h-4 w-40 bg-neutral-300 dark:bg-neutral-700" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="h-8 w-full rounded-md bg-neutral-300 dark:bg-neutral-700" />
                                                <Skeleton className="h-8 w-full rounded-md bg-neutral-300 dark:bg-neutral-700" />
                                                <Skeleton className="h-8 w-5/6 rounded-md bg-neutral-300 dark:bg-neutral-700" />
                                            </div>
                                        </div>
                                    )}

                                    {!showSkeleton && error && !data && (
                                        <p
                                            className="text-sm font-medium text-destructive"
                                            role="alert"
                                        >
                                            {error}
                                        </p>
                                    )}

                                    {!showSkeleton && data && visibleEntries.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            No DNS records match your filter.
                                        </p>
                                    )}

                                    {!showSkeleton && data && visibleEntries.length > 0 && (
                                        <div className="space-y-4">
                                            {visibleEntries.map(([type, values]) => {
                                                const list: DnsRecordItem[] = Array.isArray(values)
                                                    ? (values as DnsRecordItem[])
                                                    : []

                                                return (
                                                    <section
                                                        key={type}
                                                        aria-label={`${type.toUpperCase()} records`}
                                                        className="space-y-2"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                                {type}
                                                            </h3>
                                                            <span className="text-[10px] font-mono text-muted-foreground">
                    {list.length} record{list.length !== 1 ? 's' : ''}
                </span>
                                                        </div>

                                                        {list.length === 0 ? (
                                                            <p className="text-[11px] text-muted-foreground">
                                                                No {type} records.
                                                            </p>
                                                        ) : (
                                                            <ScrollArea className="h-40 rounded-md border">
                                                                <ul
                                                                    className="divide-y"
                                                                    aria-label={`${type} entries`}
                                                                >
                                                                    {list
                                                                        .filter((item: DnsRecordItem) => {
                                                                            if (!filter.trim()) return true
                                                                            const f = filter.toLowerCase()
                                                                            const raw =
                                                                                typeof item === 'string'
                                                                                    ? item
                                                                                    : JSON.stringify(item)
                                                                            return raw.toLowerCase().includes(f)
                                                                        })
                                                                        .map((item: DnsRecordItem, i: number) => {
                                                                            if (typeof item === 'string') {
                                                                                return (
                                                                                    <li
                                                                                        key={`${type}-${i}`}
                                                                                        className="flex items-center justify-between gap-2 px-2 py-1.5"
                                                                                    >
                                            <span className="truncate font-mono">
                                                {item}
                                            </span>
                                                                                    </li>
                                                                                )
                                                                            }

                                                                            const label =
                                                                                item.exchange ??
                                                                                item.host ??
                                                                                item.name ??
                                                                                ''
                                                                            const meta =
                                                                                'priority' in item && typeof item.priority === 'number'
                                                                                    ? `prio: ${item.priority}`
                                                                                    : undefined

                                                                            return (
                                                                                <li
                                                                                    key={`${type}-${i}`}
                                                                                    className="flex items-center justify-between gap-2 px-2 py-1.5"
                                                                                >
                                        <span className="truncate font-mono">
                                            {label || JSON.stringify(item)}
                                        </span>
                                                                                    {meta && (
                                                                                        <span className="text-[10px] font-mono text-muted-foreground">
                                                {meta}
                                            </span>
                                                                                    )}
                                                                                </li>
                                                                            )
                                                                        })}
                                                                </ul>
                                                            </ScrollArea>
                                                        )}
                                                    </section>
                                                )
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>
                    </TabsContent>

                    <TabsContent value="raw" className="mt-4">
                        <section aria-label="Raw DNS JSON payload">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <h2 className="text-base font-medium">Raw DNS response</h2>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {showSkeleton && (
                                        <div className="space-y-3" aria-hidden="true">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                                <Skeleton className="h-4 w-48 bg-neutral-300 dark:bg-neutral-700" />
                                            </div>
                                            <Skeleton className="h-40 w-full rounded-md bg-neutral-300 dark:bg-neutral-700" />
                                        </div>
                                    )}
                                    {!showSkeleton && !data && !error && (
                                        <p className="text-sm text-muted-foreground">
                                            No data to display.
                                        </p>
                                    )}
                                    {!showSkeleton && error && !data && (
                                        <p
                                            className="text-sm font-medium text-destructive"
                                            role="alert"
                                        >
                                            {error}
                                        </p>
                                    )}
                                    {!showSkeleton && data && (
                                        <ScrollArea className="h-[400px] rounded-md border bg-muted/60 p-2 text-[11px]">
                                            <pre className="whitespace-pre-wrap break-all font-mono">
                                                {JSON.stringify(data, null, 2)}
                                            </pre>
                                        </ScrollArea>
                                    )}
                                </CardContent>
                            </Card>
                        </section>
                    </TabsContent>
                </Tabs>
            </section>
        </main>
    )
}
