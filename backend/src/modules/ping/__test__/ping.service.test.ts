import { describe, test, expect, vi } from "vitest";
import { PingService } from "../ping.service";
import * as execUtil from "../../../utils/exec";

describe("PingService", () => {
    const service = new PingService();

    test("should parse valid ping output", async () => {
        vi.spyOn(execUtil, "execAsync").mockResolvedValue({
            stdout: `
        64 bytes from 8.8.8.8: time=23.1 ms
        64 bytes from 8.8.8.8: time=24.5 ms

        --- 8.8.8.8 ping statistics ---
        2 packets transmitted, 2 received, 0% packet loss
        rtt min/avg/max/stddev = 23.1/23.8/24.5/0.7 ms
      `,
            stderr: "",
        } as any);

        const result = await service.run({ target: "8.8.8.8" });

        expect(result.latencies).toEqual([23.1, 24.5]);
        expect(result.avg).toBe(23.8);
        expect(result.packetLoss).toBe(0);
    });

    test("should return empty data on no response", () => {
        const parsed = service.parse("");
        expect(parsed.latencies).toEqual([]);
        expect(parsed.avg).toBeNull();
        expect(parsed.packetLoss).toBeNull();
    });

    test("should detect packet loss", () => {
        const output = `
      --- ping statistics ---
      5 packets transmitted, 0 received, 100% packet loss
    `;

        const result = service.parse(output);
        expect(result.packetLoss).toBe(100);
    });

    test("should handle invalid domain execution error", async () => {
        vi.spyOn(execUtil, "execAsync").mockRejectedValue(new Error("unknown host"));

        await expect(service.run({ target: "invalid.local" })).rejects.toThrow();
    });
});
