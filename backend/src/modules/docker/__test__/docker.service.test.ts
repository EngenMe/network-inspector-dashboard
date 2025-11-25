import { describe, it, expect } from "vitest";
import { DockerService } from "../docker.service";

describe("DockerService", () => {
    it("handles single network with one container", async () => {
        const client = {
            listNetworks: async () => [{ Id: "net1", Name: "bridge" }],
            getNetwork: () => ({
                inspect: async () => ({
                    Containers: {
                        a1b2: {
                            Name: "container1",
                            IPv4Address: "172.17.0.2/16"
                        }
                    }
                })
            })
        } as any;

        const service = new DockerService(client);
        const result = await service.getNetworkMap();

        expect(result.nodes.length).toBe(2);
        expect(result.links.length).toBe(1);
    });

    it("handles multiple networks with multiple containers", async () => {
        const client = {
            listNetworks: async () => [
                { Id: "net1", Name: "bridge" },
                { Id: "net2", Name: "app" }
            ],
            getNetwork: (id: string) => ({
                inspect: async () =>
                    id === "net1"
                        ? {
                            Containers: {
                                c1: {
                                    Name: "a",
                                    IPv4Address: "10.0.0.2/24"
                                }
                            }
                        }
                        : {
                            Containers: {
                                c2: {
                                    Name: "b",
                                    IPv4Address: "10.0.1.2/24"
                                }
                            }
                        }
            })
        } as any;

        const service = new DockerService(client);
        const result = await service.getNetworkMap();

        expect(result.nodes.length).toBe(4);
        expect(result.links.length).toBe(2);
    });

    it("handles no networks", async () => {
        const client = {
            listNetworks: async () => []
        } as any;

        const service = new DockerService(client);
        const result = await service.getNetworkMap();

        expect(result.nodes.length).toBe(0);
        expect(result.links.length).toBe(0);
    });

    it("handles Docker socket unavailable", async () => {
        const client = {
            listNetworks: async () => {
                throw new Error("ENOENT: no such file or directory");
            }
        } as any;

        const service = new DockerService(client);
        const result = await service.getNetworkMap();

        expect(result).toEqual({ nodes: [], links: [] });
    });

    it("handles permission errors", async () => {
        const client = {
            listNetworks: async () => {
                throw new Error("EACCES: permission denied");
            }
        } as any;

        const service = new DockerService(client);
        const result = await service.getNetworkMap();

        expect(result).toEqual({ nodes: [], links: [] });
    });
});
