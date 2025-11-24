import http from "http"
import https from "https"
import { URL } from "node:url"
import type {HttpInput, HttpOutput} from "./http.types"

export type HttpServiceErrorCode = "NETWORK_ERROR" | "TIMEOUT"

export class HttpServiceError extends Error {
    code: HttpServiceErrorCode

    constructor(code: HttpServiceErrorCode, message: string) {
        super(message)
        this.code = code
        this.name = "HttpServiceError"
    }
}

const MAX_REDIRECTS = 5
const REQUEST_TIMEOUT_MS = 10000

const performRequest = (
    url: string,
    redirectsLeft: number
): Promise<HttpOutput> => {
    return new Promise((resolve, reject) => {
        let resolved = false

        const target = new URL(url)
        const client = target.protocol === "https:" ? https : http

        const req = client.request(
            {
                method: "HEAD",
                protocol: target.protocol,
                hostname: target.hostname,
                port: target.port,
                path: target.pathname + target.search
            },
            (res) => {
                if (resolved) return

                const statusCode = res.statusCode ?? 0
                const locationHeader = res.headers.location

                if (
                    statusCode >= 300 &&
                    statusCode < 400 &&
                    locationHeader &&
                    redirectsLeft > 0
                ) {
                    const nextUrl = new URL(locationHeader, target).toString()
                    resolved = true
                    performRequest(nextUrl, redirectsLeft - 1).then(resolve).catch(reject)
                    return
                }

                const headers: Record<string, string> = {}

                for (const [key, value] of Object.entries(res.headers)) {
                    if (typeof value === "string") {
                        headers[key] = value
                    } else if (Array.isArray(value)) {
                        headers[key] = value.join(", ")
                    }
                }

                resolved = true

                resolve({
                    finalUrl: target.toString(),
                    statusCode,
                    statusText: res.statusMessage ?? "",
                    protocolVersion: `HTTP/${res.httpVersion}`,
                    headers
                })
            }
        )

        req.on("error", (error: any) => {
            if (resolved) return
            resolved = true
            reject(
                new HttpServiceError(
                    "NETWORK_ERROR",
                    error?.message ?? "Network error while performing HTTP request"
                )
            )
        })

        req.setTimeout(REQUEST_TIMEOUT_MS, () => {
            if (resolved) return
            resolved = true
            req.destroy()
            reject(
                new HttpServiceError(
                    "TIMEOUT",
                    "HTTP request timed out before receiving a response"
                )
            )
        })

        req.end()
    })
}

export const httpService = async (input: HttpInput): Promise<HttpOutput> => {
    const normalizedUrl = new URL(input.url).toString()
    return performRequest(normalizedUrl, MAX_REDIRECTS)
}
