import React from "react";
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
}

export function DockerNetworkMap({ networks, containers }: DockerNetworkMapProps) {
    const grouped = React.useMemo(() => {
        const map: Record<string, DockerContainer[]> = {};
        networks.forEach((n) => (map[n.name] = []));
        containers.forEach((c) => {
            c.networks.forEach((net) => {
                if (!map[net]) map[net] = [];
                map[net].push(c);
            });
        });
        return map;
    }, [networks, containers]);

    return (
        <Card className="p-4">
            <div className="mb-3 text-sm font-medium">Docker Network Map</div>

            <div className="mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Running</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span>Stopped</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Bridge</span>
                    </div>
                </div>
            </div>

            <ScrollArea className="max-h-96 pr-3">
                <div className="space-y-6">
                    {networks.map((network) => (
                        <div key={network.name}>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="font-semibold">{network.name}</span>
                                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-600">
                  {network.driver}
                </span>
                                <span className="text-xs text-muted-foreground">{network.subnet}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                                {grouped[network.name]?.map((container) => (
                                    <div
                                        key={container.id}
                                        className="rounded border p-2 text-xs"
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
                                    </div>
                                ))}

                                {(!grouped[network.name] ||
                                    grouped[network.name].length === 0) && (
                                    <div className="text-xs text-muted-foreground">
                                        No containers attached.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}

export default DockerNetworkMap;
