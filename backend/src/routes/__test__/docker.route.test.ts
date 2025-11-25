import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import Fastify from "fastify";
import dockerRoute from "../docker.route";
import { dockerService } from "../../modules/docker/docker.service";

describe("Docker Route", () => {
    const app = Fastify();

    beforeAll(async () => {
        await app.register(dockerRoute, { prefix: "/api" });
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("returns network graph successfully", async () => {
        const mockGetNetworkMap = vi
            .spyOn(dockerService, "getNetworkMap")
            .mockResolvedValue({
                nodes: [{ id: "1", name: "bridge", type: "network" }],
                links: []
            });

        const res = await app.inject({
            method: "GET",
            url: "/api/docker/network"
        });

        expect(res.statusCode).toBe(200);
        expect(mockGetNetworkMap).toHaveBeenCalled();
    });

    it("handles invalid query params", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/api/docker/network?includeStopped=not-boolean"
        });

        expect(res.statusCode).toBe(400);
    });

    it("maps errors from docker service", async () => {
        vi.spyOn(dockerService, "getNetworkMap").mockRejectedValue(
            new Error("docker failure")
        );

        const res = await app.inject({
            method: "GET",
            url: "/api/docker/network"
        });

        expect(res.statusCode).toBe(500);
    });
});
