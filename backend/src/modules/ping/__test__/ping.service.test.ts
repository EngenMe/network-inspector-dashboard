import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { PingService } from "../ping.service";

const service = new PingService();

const originalFetch = globalThis.fetch;
const originalPerformance = globalThis.performance;

beforeEach(() => {
    vi.restoreAllMocks();
});

afterEach(() => {
    (globalThis as any).fetch = originalFetch;
    (globalThis as any).performance = originalPerformance;
});

describe("PingService", () => {
    test("should parse valid ping output", async () => {
        const times = [0, 23.1, 23.1, 47.6];
        let i = 0;

        (globalThis as any).performance = {
            now: () => times[i++],
        } as any;

        (globalThis as any).fetch = vi.fn().mockResolvedValue({} as any);

        const result = await service.run({ target: "8.8.8.8", count: 2 });

        expect(result.latencies).toEqual([23.1, 24.5]);
        expect(result.avg).toBeCloseTo(23.8, 1);
        expect(result.packetLoss).toBe(0);
        expect(result.transmitted).toBe(2);
        expect(result.received).toBe(2);
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
        (globalThis as any).performance = {
            now: () => 0,
        } as any;

        (globalThis as any).fetch = vi
            .fn()
            .mockRejectedValue(new Error("unknown host"));

        const result = await service.run({ target: "invalid.local", count: 4 });

        expect(result.received).toBe(0);
        expect(result.transmitted).toBe(4);
        expect(result.packetLoss).toBe(100);
        expect(result.latencies).toEqual([]);
    });
});
