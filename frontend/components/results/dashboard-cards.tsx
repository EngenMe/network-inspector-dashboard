import React, { useId } from 'react'
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
    errorMessage?: string
    emptyMessage?: string
}

type CardProps = {
    status?: Status
    className?: string
}

function InlineError({ message }: { message: string }) {
    return (
        <div
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            role="alert"
        >
            {message}
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div
            className="text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    )
}

function ResultCard({
                        title,
                        description,
                        status = 'idle',
                        className,
                        children,
                        errorMessage,
                        emptyMessage = 'No data yet – module not wired.',
                    }: ResultCardProps) {
    const showSkeleton = status === 'loading'
    const titleId = useId()
    const descriptionId = useId()
    const statusId = useId()

    let content: React.ReactNode

    if (showSkeleton) {
        content = (
            <div className="space-y-2" aria-hidden="true">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        )
    } else if (errorMessage) {
        content = <InlineError message={errorMessage} />
    } else if (children) {
        content = children
    } else {
        content = <EmptyState message={emptyMessage} />
    }

    const humanStatus =
        status === 'loading' ? 'Loading' : status === 'ready' ? 'Ready' : 'Idle'

    return (
        <Card
            className={cn('flex h-full flex-col', className)}
            role="group"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            aria-busy={status === 'loading'}
        >
            <CardHeader className="space-y-1 pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle
                        id={titleId}
                        className="text-sm font-semibold tracking-tight"
                    >
                        {title}
                    </CardTitle>
                    <span
                        id={statusId}
                        className="rounded-full border bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                        aria-live="polite"
                    >
                        {humanStatus}
                    </span>
                </div>
                <CardDescription
                    id={descriptionId}
                    className="text-xs text-muted-foreground"
                >
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-0">
                {content}
            </CardContent>
        </Card>
    )
}

export function DNSCard({ status = 'idle', className }: CardProps) {
    return (
        <ResultCard
            title="DNS"
            description="DNS summary will appear here once results are wired from the DNS module."
            status={status}
            className={className}
            emptyMessage="DNS module is not wired yet. Run a scan once DNS integration is connected."
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
            emptyMessage="No ping data available yet. Trigger a scan to populate this card."
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
            emptyMessage="No traceroute data yet. It will appear once the traceroute module is wired."
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
            emptyMessage="TLS details will appear here after the TLS inspector is connected."
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
            emptyMessage="HTTP inspector is not wired yet. Results will show here after integration."
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
            emptyMessage="MTU / MSS tests are not connected yet. They will populate this card later."
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
    const hasError = Boolean(error)
    const shouldRenderMap = status === 'ready' && !hasError

    return (
        <ResultCard
            title="Docker Network Map"
            description="Docker container networks and bridges will be visualized here."
            status={status}
            className={className}
            errorMessage={hasError ? `Docker integration error: ${error}` : undefined}
            emptyMessage="Waiting for scan results or Docker integration. This card will show container networks once wired."
        >
            {shouldRenderMap ? (
                <DockerNetworkMap
                    networks={networks ?? []}
                    containers={containers ?? []}
                    loading={status === 'loading'}
                    error={null}
                />
            ) : undefined}
        </ResultCard>
    )
}
