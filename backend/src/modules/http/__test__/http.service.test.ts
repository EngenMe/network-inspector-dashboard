import { describe, it, expect } from "vitest"
import { httpService, HttpServiceError } from "../http.service"
import type { HttpOutput } from "../http.types"

describe("httpService", () => {
    it("handles valid URL (success or network error)", async () => {
        let result: HttpOutput | undefined
        let error: unknown

        try {
            result = await httpService({ url: "https://example.com" })
        } catch (err) {
            error = err
        }

        if (result) {
            expect(result.finalUrl).toContain("https://")
            expect(result.protocolVersion).toMatch(/^HTTP\//)
            expect(result.statusCode).toBeGreaterThan(0)
        } else {
            expect(error).toBeInstanceOf(HttpServiceError)
        }
    })

    it("rejects for invalid URL format", async () => {
        await expect(
            httpService({ url: "not-a-valid-url" })
        ).rejects.toBeInstanceOf(TypeError)
    })

    it("maps DNS/network errors to HttpServiceError", async () => {
        await expect(
            httpService({ url: "http://nonexistent-domain-xyz-invalid-test.com" })
        ).rejects.toBeInstanceOf(HttpServiceError)
    })

    it("handles non-2xx responses without throwing when reachable", async () => {
        let result: HttpOutput | undefined
        let error: unknown

        try {
            result = await httpService({
                url: "https://example.com/non-existent-path-hopefully-404"
            })
        } catch (err) {
            error = err
        }

        if (result) {
            expect(result.statusCode).toBeGreaterThanOrEqual(400)
            expect(result.finalUrl).toContain("https://")
        } else {
            expect(error).toBeInstanceOf(HttpServiceError)
        }
    })
})
