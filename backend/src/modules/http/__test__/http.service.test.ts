import { describe, it, expect } from "vitest"
import { httpService } from "../http.service"

describe("httpService", () => {
    it("should be a function", () => {
        expect(typeof httpService).toBe("function")
    })
})
