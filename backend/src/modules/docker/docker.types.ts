export type DockerNetworkNode = {
    id: string;
    name: string;
    type: "network" | "container";
    image?: string;
    state?: string;
    ipAddress?: string;
};

export type DockerNetworkLink = {
    sourceId: string;
    targetId: string;
    relation: string;
};

export type DockerNetworkResult = {
    nodes: DockerNetworkNode[];
    links: DockerNetworkLink[];
};
