'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export interface DockerNetwork {
    name: string
    driver: string
    subnet: string
}

export interface DockerContainer {
    id: string
    name: string
    status: string
    networks: string[]
}

export interface DockerNetworkMapProps {
    networks: DockerNetwork[]
    containers: DockerContainer[]
    loading?: boolean
    error?: string | null
}

export function DockerNetworkMap({
                                     networks,
                                     containers,
                                     loading = false,
                                     error,
                                 }: DockerNetworkMapProps) {
    const grouped = React.useMemo(() => {
        const map: Record<string, DockerContainer[]> = {}
        networks.forEach(n => (map[n.name] = []))
        containers.forEach(c => {
            const primary = c.networks[0]
            if (!map[primary]) map[primary] = []
            map[primary].push(c)
        })
        return map
    }, [networks, containers])

    if (loading) {
        return (
            <div className="rounded-md border bg-muted/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-md border bg-muted/40 p-4 text-xs">
                <div className="mb-2 text-sm font-medium">Docker network map</div>
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive">
                    {error}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                    Make sure the Docker daemon is running and the integration is configured.
                </p>
            </div>
        )
    }

    if (!networks.length && !containers.length) {
        return (
            <div className="rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
                <div className="mb-1 text-sm font-medium text-foreground">
                    Docker network map
                </div>
                No Docker networks or containers detected in the current environment.
            </div>
        )
    }

    return (
        <div className="relative rounded-md border bg-muted/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                    <div className="text-sm font-semibold tracking-tight">
                        Docker network topology
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        Networks and their attached containers. Useful to verify how the app
                        stack is wired inside Docker.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Running</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span>Stopped</span>
                    </div>
                </div>
            </div>

            <ScrollArea className="max-h-96 rounded-md border bg-background/80 pr-3">
                <div className="space-y-4 p-3">
                    {networks.map(network => (
                        <div
                            key={network.name}
                            className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {network.name}
                  </span>
                                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-medium text-sky-600">
                    {network.driver}
                  </span>
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground">
                  {network.subnet}
                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {grouped[network.name]?.length ? (
                                    grouped[network.name].map(container => (
                                        <div
                                            key={container.id}
                                            className="relative cursor-pointer rounded-md border bg-background/80 px-3 py-2 text-xs transition-colors hover:bg-accent/70"
                                        >
                                            <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] font-medium">
                          {container.name}
                        </span>
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        container.status === 'running'
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                />
                                            </div>
                                            <div className="font-mono text-[10px] text-muted-foreground">
                                                {container.id.slice(0, 12)}
                                            </div>
                                            <div className="mt-1 font-mono text-[10px] text-muted-foreground/80">
                                                {container.networks.join(', ')}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-[11px] text-muted-foreground">
                                        No containers attached to this network.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default DockerNetworkMap
