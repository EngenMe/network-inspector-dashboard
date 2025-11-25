import React from "react";

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

type UINodeType = "network" | "container";

type UINode = {
    id: string;
    label: string;
    type: UINodeType;
    group?: string;
    status?: string;
};

type UIEdge = {
    id: string;
    from: string;
    to: string;
};

export function DockerNetworkMap({ networks, containers }: DockerNetworkMapProps) {
    const nodes: UINode[] = React.useMemo(
        () => [
            ...networks.map((network) => ({
                id: `network:${network.name}`,
                label: network.name,
                type: "network" as const,
                group: network.driver,
            })),
            ...containers.map((container) => ({
                id: `container:${container.id}`,
                label: container.name,
                type: "container" as const,
                status: container.status,
            })),
        ],
        [networks, containers],
    );

    const edges: UIEdge[] = React.useMemo(
        () =>
            containers.flatMap((container) =>
                container.networks.map((networkName) => ({
                    id: `edge:${container.id}:${networkName}`,
                    from: `container:${container.id}`,
                    to: `network:${networkName}`,
                })),
            ),
        [containers],
    );

    return (
        <div>
            <span className="hidden" data-nodes={nodes.length} data-edges={edges.length} />
        </div>
    );
}

export default DockerNetworkMap;
