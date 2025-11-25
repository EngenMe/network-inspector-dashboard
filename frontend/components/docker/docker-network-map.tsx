import React, { useRef, useLayoutEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DockerNetwork {
    name: string;
    driver: string;
    subnet: string;
}

export interface DockerContainer {
    id: string;
    name: string;
    status: string;
    networks: string[];
}

export interface DockerNetworkMapProps {
    networks: DockerNetwork[];
    containers: DockerContainer[];
    loading?: boolean;
    error?: string;
}

export function DockerNetworkMap({
                                     networks,
                                     containers,
                                     loading = false,
                                     error,
                                 }: DockerNetworkMapProps) {
    const [hoverNetwork, setHoverNetwork] = useState<string | null>(null);
    const [hoverContainer, setHoverContainer] = useState<string | null>(null);

    const grouped = React.useMemo(() => {
        const map: Record<string, DockerContainer[]> = {};
        networks.forEach((n) => (map[n.name] = []));
        containers.forEach((c) => {
            const primary = c.networks[0];
            if (!map[primary]) map[primary] = [];
            map[primary].push(c);
        });
        return map;
    }, [networks, containers]);

    const networkRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [edges, setEdges] = useState<
        { id: string; from: { x: number; y: number }; to: { x: number; y: number } }[]
    >([]);

    useLayoutEffect(() => {
        const newEdges: typeof edges = [];

        containers.forEach((container) => {
            container.networks.forEach((networkName) => {
                const cRef = containerRefs.current[container.id];
                const nRef = networkRefs.current[networkName];
                if (!cRef || !nRef) return;

                const cRect = cRef.getBoundingClientRect();
                const nRect = nRef.getBoundingClientRect();

                newEdges.push({
                    id: `${container.id}-${networkName}`,
                    from: {
                        x: cRect.left + cRect.width / 2,
                        y: cRect.top + cRect.height / 2,
                    },
                    to: {
                        x: nRect.left + nRect.width / 2,
                        y: nRect.top + nRect.height / 2,
                    },
                });
            });
        });

        requestAnimationFrame(() => setEdges(newEdges));
    }, [containers, networks]);

    if (loading) {
        return (
            <Card className="p-4 text-sm text-muted-foreground">
                Loading Docker network data…
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-4">
                <div className="mb-3 rounded bg-red-500/10 p-2 text-sm text-red-600">
                    {error}
                </div>
            </Card>
        );
    }

    if (networks.length === 0 || containers.length === 0) {
        return (
            <Card className="p-4 text-sm text-muted-foreground">
                No Docker networks or containers found.
            </Card>
        );
    }

    return (
        <Card className="relative p-4">
            <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
                {edges.map((edge) => (
                    <line
                        key={edge.id}
                        x1={edge.from.x}
                        y1={edge.from.y}
                        x2={edge.to.x}
                        y2={edge.to.y}
                        stroke={
                            hoverNetwork && edge.id.includes(hoverNetwork)
                                ? "rgba(0,150,255,0.7)"
                                : "rgba(100,100,100,0.35)"
                        }
                        strokeWidth={hoverNetwork ? 2 : 1.5}
                        className="hidden md:block"
                    />
                ))}
            </svg>

            <ScrollArea className="max-h-96 pr-3">
                <div className="space-y-6">
                    {networks.map((network) => (
                        <div key={network.name}>
                            <div
                                ref={(el) => (networkRefs.current[network.name] = el)}
                                onMouseEnter={() => setHoverNetwork(network.name)}
                                onMouseLeave={() => setHoverNetwork(null)}
                                className="mb-2 flex cursor-pointer items-center gap-2"
                            >
                                <span className="font-semibold">{network.name}</span>
                                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-600">
                  {network.driver}
                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                                {grouped[network.name].map((container) => (
                                    <div
                                        key={container.id}
                                        ref={(el) => (containerRefs.current[container.id] = el)}
                                        onMouseEnter={() => setHoverContainer(container.id)}
                                        onMouseLeave={() => setHoverContainer(null)}
                                        className={`rounded border p-2 text-xs cursor-pointer relative ${
                                            hoverContainer === container.id
                                                ? "bg-accent"
                                                : hoverNetwork &&
                                                container.networks.includes(hoverNetwork)
                                                    ? "bg-blue-500/10"
                                                    : ""
                                        }`}
                                    >
                                        <div className="mb-1 flex items-center justify-between">
                                            <span>{container.name}</span>
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    container.status === "running"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            />
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {container.id.slice(0, 12)}
                                        </div>
                                        <div className="absolute left-1/2 top-0 mt-[-1.2rem] -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:group-hover:opacity-100">
                                            {container.networks.join(", ")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}

export default DockerNetworkMap;
