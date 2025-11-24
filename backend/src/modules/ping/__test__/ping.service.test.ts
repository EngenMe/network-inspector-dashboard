import { describe, test, expect } from 'vitest'
import { PingService } from "../ping.service";

describe("PingService", () => {
    test("should parse ping output", async () => {
        const service = new PingService();
        expect(service.parse("")).toBeDefined();
    });
});
