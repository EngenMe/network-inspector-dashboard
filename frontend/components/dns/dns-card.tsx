'use client'

import { useMemo, useState } from 'react'
import type { DnsLookupResult, DnsRecordType } from '@/lib/types/dns'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Copy } from 'lucide-react'

type DnsCardProps = {
    domain: string
    result?: DnsLookupResult
    isLoading?: boolean
    error?: string | null
    onRetry?: () => void
}

const recordTypes: DnsRecordType[] = ['A', 'AAAA', 'MX', 'CNAME', 'NS', 'SOA', 'TXT']

export function DnsCard({ domain, result, isLoading, error, onRetry }: DnsCardProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const activeTypes = useMemo(() => {
        if (!result?.records) return []
        const r = result.records
        const types: DnsRecordType[] = []
        if (r.a?.length) types.push('A')
        if (r.aaaa?.length) types.push('AAAA')
        if (r.mx?.length) types.push('MX')
        if (r.cname?.length) types.push('CNAME')
        if (r.ns?.length) types.push('NS')
        if (r.soa) types.push('SOA')
        if (r.txt?.length) types.push('TXT')
        return types.length ? types : recordTypes
    }, [result])

    const defaultTab = activeTypes[0] ?? 'A'

    const handleCopy = async (value: string, label: string) => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(label)
            setTimeout(() => setCopied(current => (current === label ? null : current)), 1500)
        } catch {
            setCopied(null)
        }
    }

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-2 h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>DNS</CardTitle>
                    <CardDescription>{domain || 'No domain provided'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </div>
                    {onRetry && (
                        <Button size="sm" variant="outline" onClick={onRetry}>
                            Retry
                        </Button>
                    )}
                </CardContent>
            </Card>
        )
    }

    if (!result) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>DNS</CardTitle>
                    <CardDescription>Waiting for a scan…</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Run a scan to see DNS records for this domain.
                </CardContent>
            </Card>
        )
    }

    const { records, resolvedAt } = result

    const countForType = (type: DnsRecordType) => {
        switch (type) {
            case 'A':
                return records.a?.length ?? 0
            case 'AAAA':
                return records.aaaa?.length ?? 0
            case 'MX':
                return records.mx?.length ?? 0
            case 'CNAME':
                return records.cname?.length ?? 0
            case 'NS':
                return records.ns?.length ?? 0
            case 'SOA':
                return records.soa ? 1 : 0
            case 'TXT':
                return records.txt?.length ?? 0
        }
    }

    const renderTabContent = (type: DnsRecordType) => {
        switch (type) {
            case 'A':
                return (
                    <ValueList
                        items={records.a ?? []}
                        emptyLabel="No A records found"
                        onCopy={value => handleCopy(value, 'A')}
                        copied={copied === 'A'}
                    />
                )
            case 'AAAA':
                return (
                    <ValueList
                        items={records.aaaa ?? []}
                        emptyLabel="No AAAA records found"
                        onCopy={value => handleCopy(value, 'AAAA')}
                        copied={copied === 'AAAA'}
                    />
                )
            case 'MX':
                return (
                    <MxList
                        items={records.mx ?? []}
                        emptyLabel="No MX records found"
                        onCopy={value => handleCopy(value, 'MX')}
                        copied={copied === 'MX'}
                    />
                )
            case 'CNAME':
                return (
                    <ValueList
                        items={records.cname ?? []}
                        emptyLabel="No CNAME records found"
                        onCopy={value => handleCopy(value, 'CNAME')}
                        copied={copied === 'CNAME'}
                    />
                )
            case 'NS':
                return (
                    <ValueList
                        items={records.ns ?? []}
                        emptyLabel="No NS records found"
                        onCopy={value => handleCopy(value, 'NS')}
                        copied={copied === 'NS'}
                    />
                )
            case 'SOA':
                return (
                    <SoaView
                        soa={records.soa ?? null}
                        emptyLabel="No SOA record found"
                        onCopy={value => handleCopy(value, 'SOA')}
                        copied={copied === 'SOA'}
                    />
                )
            case 'TXT':
                return (
                    <ValueList
                        items={records.txt ?? []}
                        emptyLabel="No TXT records found"
                        onCopy={value => handleCopy(value, 'TXT')}
                        copied={copied === 'TXT'}
                    />
                )
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        DNS
                        <Badge variant="outline" className="text-xs font-normal">
                            {domain}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Last resolved:{' '}
                        {resolvedAt ? new Date(resolvedAt).toLocaleString() : 'unknown'}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="flex flex-wrap justify-start gap-1">
                        {recordTypes.map(type => {
                            const count = countForType(type)
                            const isActive = activeTypes.includes(type)
                            return (
                                <TabsTrigger
                                    key={type}
                                    value={type}
                                    disabled={!isActive && !count}
                                    className="flex items-center gap-1"
                                >
                                    <span>{type}</span>
                                    <Badge
                                        variant={count ? 'default' : 'outline'}
                                        className="text-[10px] font-normal"
                                    >
                                        {count}
                                    </Badge>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {recordTypes.map(type => (
                        <TabsContent key={type} value={type} className="mt-4">
                            {renderTabContent(type)}
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}

type ValueListProps = {
    items: string[]
    emptyLabel: string
    onCopy: (value: string) => void
    copied?: boolean
}

function ValueList({ items, emptyLabel, onCopy, copied }: ValueListProps) {
    if (!items.length) {
        return (
            <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                {emptyLabel}
            </div>
        )
    }

    return (
        <ScrollArea className="max-h-56 rounded-md border">
            <ul className="divide-y text-sm">
                {items.map((value, idx) => (
                    <li key={`${value}-${idx}`} className="flex items-center justify-between gap-2 px-3 py-2">
                        <span className="break-all font-mono text-xs">{value}</span>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => onCopy(value)}
                        >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy</span>
                        </Button>
                    </li>
                ))}
            </ul>
            {copied && (
                <div className="border-t px-3 py-1 text-xs text-muted-foreground">
                    Copied to clipboard
                </div>
            )}
        </ScrollArea>
    )
}

type MxListProps = {
    items: { priority: number; exchange: string }[]
    emptyLabel: string
    onCopy: (value: string) => void
    copied?: boolean
}

function MxList({ items, emptyLabel, onCopy, copied }: MxListProps) {
    if (!items.length) {
        return (
            <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                {emptyLabel}
            </div>
        )
    }

    return (
        <ScrollArea className="max-h-56 rounded-md border">
            <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-muted">
                <tr>
                    <th className="px-3 py-2 font-medium">Priority</th>
                    <th className="px-3 py-2 font-medium">Exchange</th>
                    <th className="px-3 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {items.map((mx, idx) => {
                    const value = `${mx.priority} ${mx.exchange}`
                    return (
                        <tr key={`${mx.exchange}-${mx.priority}-${idx}`} className="border-t">
                            <td className="px-3 py-2 align-top">{mx.priority}</td>
                            <td className="px-3 py-2 align-top break-all font-mono">{mx.exchange}</td>
                            <td className="px-3 py-2 align-top">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => onCopy(value)}
                                >
                                    <Copy className="h-3 w-3" />
                                    <span className="sr-only">Copy</span>
                                </Button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            {copied && (
                <div className="border-t px-3 py-1 text-xs text-muted-foreground">
                    Copied to clipboard
                </div>
            )}
        </ScrollArea>
    )
}

type SoaViewProps = {
    soa: {
        primary: string
        admin: string
        serial: number
        refresh: number
        retry: number
        expire: number
        minimum: number
    } | null
    emptyLabel: string
    onCopy: (value: string) => void
    copied?: boolean
}

function SoaView({ soa, emptyLabel, onCopy, copied }: SoaViewProps) {
    if (!soa) {
        return (
            <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                {emptyLabel}
            </div>
        )
    }

    const asBindLine = `${soa.primary} ${soa.admin} ${soa.serial} ${soa.refresh} ${soa.retry} ${soa.expire} ${soa.minimum}`

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                    Start of Authority (SOA) record
                </p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => onCopy(asBindLine)}
                >
                    <Copy className="mr-1 h-3 w-3" />
                    {copied ? 'Copied' : 'Copy line'}
                </Button>
            </div>
            <div className="grid gap-2 text-xs md:grid-cols-2">
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Primary
                    </div>
                    <div className="mt-1 break-all font-mono">{soa.primary}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Admin
                    </div>
                    <div className="mt-1 break-all font-mono">{soa.admin}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Serial
                    </div>
                    <div className="mt-1 font-mono">{soa.serial}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Refresh
                    </div>
                    <div className="mt-1 font-mono">{soa.refresh}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Retry
                    </div>
                    <div className="mt-1 font-mono">{soa.retry}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Expire
                    </div>
                    <div className="mt-1 font-mono">{soa.expire}</div>
                </div>
                <div className="rounded-md border px-3 py-2 md:col-span-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Minimum
                    </div>
                    <div className="mt-1 font-mono">{soa.minimum}</div>
                </div>
            </div>
        </div>
    )
}
