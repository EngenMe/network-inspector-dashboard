import { describe, it, beforeAll, afterAll, expect } from "vitest"
import Fastify from "fastify"
import httpRoute from "../../../routes/http.route"

const buildApp = async () => {
    const app = Fastify()

    app.register(httpRoute, { prefix: "/api" })
    await app.ready()

    return app
}

let app: Awaited<ReturnType<typeof buildApp>>

describe("HTTP route /api/http-info", () => {
    beforeAll(async () => {
        app = await buildApp()
    })

    afterAll(async () => {
        await app.close()
    })

    it("handles valid url (success or network error)", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/api/http-info?url=https://example.com"
        })

        expect([200, 502, 504]).toContain(response.statusCode)

        const body = response.json()

        if (response.statusCode === 200) {
            expect(body.statusCode).toBeGreaterThan(0)
            expect(body.finalUrl).toContain("https://")
            expect(body.protocolVersion).toMatch(/^HTTP\//)
        } else {
            expect(["NETWORK_ERROR", "TIMEOUT"]).toContain(body.error)
        }
    })

    it("returns 400 for missing url", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/api/http-info"
        })

        expect(response.statusCode).toBe(400)

        const body = response.json()

        expect(body.error).toBe("INVALID_QUERY")
    })

    it("returns 400 for invalid url", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/api/http-info?url=not-a-valid-url"
        })

        expect(response.statusCode).toBe(400)

        const body = response.json()

        expect(body.error).toBe("INVALID_QUERY")
    })

    it("maps network errors to 502/504", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/api/http-info?url=http://nonexistent-domain-xyz-invalid-test.com"
        })

        expect([502, 504]).toContain(response.statusCode)

        const body = response.json()

        expect(["NETWORK_ERROR", "TIMEOUT"]).toContain(body.error)
    })
})
