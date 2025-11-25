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
            setTimeout(
                () => setCopied(current => (current === label ? null : current)),
                1500,
            )
        } catch {
            setCopied(null)
        }
    }

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>DNS</CardTitle>
                    <CardDescription className="font-mono text-xs">
                        {domain || 'No domain provided'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        DNS lookup failed: {error}
                    </div>
                    {onRetry && (
                        <Button size="sm" variant="outline" onClick={onRetry}>
                            Retry lookup
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
                <CardContent className="text-xs text-muted-foreground">
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
                        title="A records"
                        items={records.a ?? []}
                        emptyLabel="No A records found"
                        onCopy={value => handleCopy(value, 'A')}
                        copied={copied === 'A'}
                    />
                )
            case 'AAAA':
                return (
                    <ValueList
                        title="AAAA records"
                        items={records.aaaa ?? []}
                        emptyLabel="No AAAA records found"
                        onCopy={value => handleCopy(value, 'AAAA')}
                        copied={copied === 'AAAA'}
                    />
                )
            case 'MX':
                return (
                    <MxList
                        title="MX records"
                        items={records.mx ?? []}
                        emptyLabel="No MX records found"
                        onCopy={value => handleCopy(value, 'MX')}
                        copied={copied === 'MX'}
                    />
                )
            case 'CNAME':
                return (
                    <ValueList
                        title="CNAME records"
                        items={records.cname ?? []}
                        emptyLabel="No CNAME records found"
                        onCopy={value => handleCopy(value, 'CNAME')}
                        copied={copied === 'CNAME'}
                    />
                )
            case 'NS':
                return (
                    <ValueList
                        title="NS records"
                        items={records.ns ?? []}
                        emptyLabel="No NS records found"
                        onCopy={value => handleCopy(value, 'NS')}
                        copied={copied === 'NS'}
                    />
                )
            case 'SOA':
                return (
                    <SoaView
                        title="SOA record"
                        soa={records.soa ?? null}
                        emptyLabel="No SOA record found"
                        onCopy={value => handleCopy(value, 'SOA')}
                        copied={copied === 'SOA'}
                    />
                )
            case 'TXT':
                return (
                    <ValueList
                        title="TXT records"
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
                        <Badge variant="outline" className="font-mono text-[11px] font-normal">
                            {domain || '—'}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-[11px]">
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
                                    className="flex items-center gap-1 text-xs"
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
    title: string
    items: string[]
    emptyLabel: string
    onCopy: (value: string) => void
    copied?: boolean
}

function ValueList({ title, items, emptyLabel, onCopy, copied }: ValueListProps) {
    if (!items.length) {
        return (
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{title}</p>
                <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                    {emptyLabel}
                </div>
            </div>
        )
    }

    let copiedNode: JSX.Element | undefined
    if (copied) {
        copiedNode = (
            <div className="text-[11px] text-muted-foreground">Copied to clipboard</div>
        )
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <ScrollArea className="h-56 rounded-md border">
                <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-muted/60">
                    <tr>
                        <th className="px-3 py-2 font-medium">Value</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((value, index) => (
                        <tr key={`${value}-${index}`} className="border-t">
                            <td className="px-3 py-2 align-top">
                                <span className="break-all font-mono text-[11px]">{value}</span>
                            </td>
                            <td className="px-3 py-2 align-top text-right">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => onCopy(value)}
                                >
                                    <Copy className="h-3 w-3" />
                                    <span className="sr-only">Copy value</span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </ScrollArea>
            {copiedNode}
        </div>
    )
}

type MxListProps = {
    title: string
    items: { priority: number; exchange: string }[]
    emptyLabel: string
    onCopy: (value: string) => void
    copied?: boolean
}

function MxList({ title, items, emptyLabel, onCopy, copied }: MxListProps) {
    if (!items.length) {
        return (
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{title}</p>
                <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                    {emptyLabel}
                </div>
            </div>
        )
    }

    let copiedNode: JSX.Element | undefined
    if (copied) {
        copiedNode = (
            <div className="border-t px-3 py-1 text-[11px] text-muted-foreground">
                Copied to clipboard
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <ScrollArea className="h-56 rounded-md border">
                <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-muted/60">
                    <tr>
                        <th className="px-3 py-2 font-medium">Priority</th>
                        <th className="px-3 py-2 font-medium">Exchange</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((mx, idx) => {
                        const value = `${mx.priority} ${mx.exchange}`
                        return (
                            <tr
                                key={`${mx.exchange}-${mx.priority}-${idx}`}
                                className="border-t"
                            >
                                <td className="px-3 py-2 align-top">{mx.priority}</td>
                                <td className="px-3 py-2 align-top">
                    <span className="break-all font-mono text-[11px]">
                      {mx.exchange}
                    </span>
                                </td>
                                <td className="px-3 py-2 align-top text-right">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => onCopy(value)}
                                    >
                                        <Copy className="h-3 w-3" />
                                        <span className="sr-only">Copy record</span>
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {copiedNode}
            </ScrollArea>
        </div>
    )
}

type SoaViewProps = {
    title: string
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

function SoaView({ title, soa, emptyLabel, onCopy, copied }: SoaViewProps) {
    if (!soa) {
        return (
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{title}</p>
                <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                    {emptyLabel}
                </div>
            </div>
        )
    }

    const asBindLine = `${soa.primary} ${soa.admin} ${soa.serial} ${soa.refresh} ${soa.retry} ${soa.expire} ${soa.minimum}`

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">{title}</p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px]"
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
                    <div className="mt-1 break-all font-mono text-[11px]">
                        {soa.primary}
                    </div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Admin
                    </div>
                    <div className="mt-1 break-all font-mono text-[11px]">
                        {soa.admin}
                    </div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Serial
                    </div>
                    <div className="mt-1 font-mono text-[11px]">{soa.serial}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Refresh
                    </div>
                    <div className="mt-1 font-mono text-[11px]">{soa.refresh}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Retry
                    </div>
                    <div className="mt-1 font-mono text-[11px]">{soa.retry}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Expire
                    </div>
                    <div className="mt-1 font-mono text-[11px]">{soa.expire}</div>
                </div>
                <div className="rounded-md border px-3 py-2 md:col-span-2">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">
                        Minimum
                    </div>
                    <div className="mt-1 font-mono text-[11px]">{soa.minimum}</div>
                </div>
            </div>
        </div>
    )
}
