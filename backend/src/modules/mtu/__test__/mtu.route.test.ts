import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import fastify from "fastify";
import mtuRoute from "../../../routes/mtu.route";
import * as serviceModule from "../mtu.service";

describe("MTU Route", () => {
    const app = fastify();

    beforeAll(async () => {
        await app.register(mtuRoute);
    });

    afterAll(async () => {
        await app.close();
    });

    test("successful response", async () => {
        vi.spyOn(serviceModule.MtuService.prototype, "run").mockResolvedValue({
            pathMtu: 1400,
            estimatedMss: 1360,
            successfulSizes: [1200, 1300, 1400],
            failedSizes: [],
            rawOutput: []
        });

        const res = await app.inject({
            method: "GET",
            url: "/api/mtu-mss?target=example.com"
        });

        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.pathMtu).toBe(1400);
    });

    test("missing target", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/api/mtu-mss"
        });

        expect(res.statusCode).toBe(400);
    });

    test("invalid target", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/api/mtu-mss?target="
        });

        expect(res.statusCode).toBe(400);
    });

    test("service error mapping", async () => {
        vi.spyOn(serviceModule.MtuService.prototype, "run").mockRejectedValue(new Error("fail"));

        const res = await app.inject({
            method: "GET",
            url: "/api/mtu-mss?target=example.com"
        });

        expect(res.statusCode).toBe(500);
    });
});
