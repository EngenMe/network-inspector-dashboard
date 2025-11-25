import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import DockerNetworkMap from "@/components/docker/docker-network-map"

type Status = 'idle' | 'loading' | 'ready'

type ResultCardProps = {
    title: string
    description: string
    status?: Status
    className?: string
    children?: React.ReactNode
}

function statusLabel(status: Status) {
    if (status === 'loading') return 'Loading'
    if (status === 'ready') return 'Ready'
    return 'Idle'
}

function ResultCard({
                        title,
                        description,
                        status = 'idle',
                        className,
                        children,
                    }: ResultCardProps) {
    const showSkeleton = status === 'loading'

    return (
        <Card className={cn('flex flex-col', className)}>
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                    <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {statusLabel(status)}
                    </span>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                {showSkeleton ? (
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ) : children ? (
                    children
                ) : (
                    <div className="text-xs text-muted-foreground">
                        No data yet – module not wired.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

type CardProps = {
    status?: Status
    className?: string
}

export function DNSCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="DNS"
            description="DNS summary card will appear here once results are shared from the DNS module."
            status={status}
            className={className}
        />
    )
}

export function PingCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="Ping"
            description="Ping latency and packet loss graphs will be added here."
            status={status}
            className={className}
        />
    )
}

export function TracerouteCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="Traceroute"
            description="Hop-by-hop route visualization will be rendered in this card."
            status={status}
            className={className}
        />
    )
}

export function TLSCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="TLS"
            description="Certificate chain and cipher details will be shown here."
            status={status}
            className={className}
        />
    )
}

export function HttpCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="HTTP"
            description="HTTP status, headers, and protocol information will be displayed here."
            status={status}
            className={className}
        />
    )
}

export function MTUMSSCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="MTU / MSS"
            description="MTU and MSS behaviors will be summarized here after implementation."
            status={status}
            className={className}
        />
    )
}

export function DockerNetworkCard({
                                      status = 'idle',
                                      className,
                                      networks,
                                      containers,
                                      error,
                                  }: {
    status?: Status
    className?: string
    networks?: any[]
    containers?: any[]
    error?: string
}) {
    return (
        <ResultCard
            title="Docker Network Map"
            description="Docker container networks and bridges will be visualized here."
            status={status}
            className={className}
        >
            {status === 'ready' && (
                <DockerNetworkMap
                    networks={networks ?? []}
                    containers={containers ?? []}
                    loading={status === 'loading'}
                    error={error}
                />
            )}
        </ResultCard>
    )
}
