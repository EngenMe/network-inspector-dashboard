import { describe, test, expect, vi, beforeEach } from "vitest";
import { MtuService } from "../mtu.service";
import * as execModule from "../../../utils/exec";

describe("MtuService", () => {
    const service = new MtuService();

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("normal case with clear MTU", async () => {
        vi.spyOn(execModule, "execAsync").mockResolvedValue({
            stdout: "0% packet loss",
            stderr: ""
        });

        const result = await service.run({ target: "example.com", startSize: 1200, endSize: 1220, step: 10 });

        expect(result.pathMtu).toBe(1220);
        expect(result.estimatedMss).toBe(1180);
        expect(result.successfulSizes).toEqual([1200, 1210, 1220]);
        expect(result.failedSizes.length).toBe(0);
    });

    test("all sizes fail", async () => {
        vi.spyOn(execModule, "execAsync").mockResolvedValue({
            stdout: "",
            stderr: "100% packet loss"
        });

        const result = await service.run({ target: "example.com", startSize: 1200, endSize: 1220, step: 10 });

        expect(result.pathMtu).toBeNull();
        expect(result.estimatedMss).toBeNull();
        expect(result.successfulSizes.length).toBe(0);
        expect(result.failedSizes).toEqual([1200, 1210, 1220]);
    });

    test("mixed success and failure pattern", async () => {
        const mock = vi.spyOn(execModule, "execAsync");

        mock
            .mockResolvedValueOnce({ stdout: "0% packet loss", stderr: "" }) // 1200
            .mockResolvedValueOnce({ stdout: "", stderr: "100% packet loss" }) // 1210
            .mockResolvedValueOnce({ stdout: "0% packet loss", stderr: "" }); // 1220

        const result = await service.run({ target: "example.com", startSize: 1200, endSize: 1220, step: 10 });

        expect(result.pathMtu).toBe(1220);
        expect(result.estimatedMss).toBe(1180);
        expect(result.successfulSizes).toEqual([1200, 1220]);
        expect(result.failedSizes).toEqual([1210]);
    });
});
