import { describe, it, expect } from "vitest";
import { dockerService } from "../docker.service";

describe("DockerService", () => {
    it("returns empty graph structure", async () => {
        const result = await dockerService.getNetworkMap();
        expect(Array.isArray(result.nodes)).toBe(true);
        expect(Array.isArray(result.links)).toBe(true);
    });
});