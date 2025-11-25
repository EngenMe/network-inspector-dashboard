import { DockerNetworkResult } from "./docker.types";

export class DockerService {
    async getNetworkMap(): Promise<DockerNetworkResult> {
        return { nodes: [], links: [] };
    }
}

export const dockerService = new DockerService();
