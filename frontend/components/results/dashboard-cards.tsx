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
import DockerNetworkMap from '@/components/docker/docker-network-map'
import type {
    DockerNetwork,
    DockerContainer,
} from '@/components/docker/docker-network-map'

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
        <Card className={cn('flex h-full flex-col', className)}>
            <CardHeader className="space-y-1 pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-semibold tracking-tight">
                        {title}
                    </CardTitle>
                    <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {statusLabel(status)}
          </span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-0">
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
            description="DNS summary will appear here once results are wired from the DNS module."
            status={status}
            className={className}
        />
    )
}

export function PingCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="Ping"
            description="Ping latency and packet loss timelines will be displayed here."
            status={status}
            className={className}
        />
    )
}

export function TracerouteCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="Traceroute"
            description="Hop-by-hop route visualizations will be rendered in this card."
            status={status}
            className={className}
        />
    )
}

export function TLSCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="TLS"
            description="Certificate chain, protocol version, and cipher suite details will show here."
            status={status}
            className={className}
        />
    )
}

export function HttpCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="HTTP"
            description="HTTP status, response headers, and protocol information will be displayed here."
            status={status}
            className={className}
        />
    )
}

export function MTUMSSCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="MTU / MSS"
            description="MTU and MSS behavior across the path will be summarized here."
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
    networks?: DockerNetwork[]
    containers?: DockerContainer[]
    error?: string | null
}) {
    const shouldRenderMap = status === 'ready'

    return (
        <ResultCard
            title="Docker network map"
            description="Docker container networks and bridges will be visualized here."
            status={status}
            className={className}
        >
            {shouldRenderMap ? (
                <DockerNetworkMap
                    networks={networks ?? []}
                    containers={containers ?? []}
                    loading={status === 'loading'}
                    error={error ?? undefined}
                />
            ) : (
                <div className="text-xs text-muted-foreground">
                    Waiting for scan results or Docker integration.
                </div>
            )}
        </ResultCard>
    )
}
