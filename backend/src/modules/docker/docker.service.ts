import Docker from "dockerode";
import {
    DockerNetworkResult,
    DockerNetworkNode,
    DockerNetworkLink,
    DockerNetworkInput
} from "./docker.types";

export class DockerService {
    private client = new Docker({ socketPath: "/var/run/docker.sock" });

    async getNetworkMap(input?: DockerNetworkInput): Promise<DockerNetworkResult> {
        try {
            const networks = await this.client.listNetworks();
            const nodes: DockerNetworkNode[] = [];
            const links: DockerNetworkLink[] = [];

            for (const net of networks) {
                const networkNode: DockerNetworkNode = {
                    id: net.Id,
                    name: net.Name,
                    type: "network"
                };

                nodes.push(networkNode);

                const network = this.client.getNetwork(net.Id);
                const details = await network.inspect();
                const containers = details.Containers ? Object.values(details.Containers) : [];

                for (const container of containers) {
                    const containerNode: DockerNetworkNode = {
                        id: container.Name,
                        name: container.Name,
                        type: "container",
                        ipAddress: container.IPv4Address?.split("/")[0]
                    };

                    nodes.push(containerNode);

                    links.push({
                        sourceId: containerNode.id,
                        targetId: networkNode.id,
                        relation: "attached"
                    });
                }
            }

            return { nodes, links };
        } catch {
            return { nodes: [], links: [] };
        }
    }
}

export const dockerService = new DockerService();
