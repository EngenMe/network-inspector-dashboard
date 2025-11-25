import type { HttpInspectorResult } from '../types/http'
import type { NormalizedApiError } from '../types/dns'

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export class HttpApiError extends Error implements NormalizedApiError {
    status: number
    code: string
    details?: unknown

    constructor(init: NormalizedApiError) {
        super(init.message)
        this.name = 'HttpApiError'
        this.status = init.status
        this.code = init.code
        this.details = init.details
    }
}

export interface FetchHttpOptions {
    debug?: boolean
    baseUrl?: string
    signal?: AbortSignal
}

export const fetchHttpInfo = async (
    urlToFetch: string,
    options: FetchHttpOptions = {},
): Promise<HttpInspectorResult> => {
    const baseUrl = options.baseUrl ?? defaultBaseUrl

    const params = new URLSearchParams()
    params.set('url', urlToFetch)
    if (options.debug) params.set('debug', '1')

    const url = `${baseUrl}/api/http-info?${params.toString()}`

    let res: Response

    try {
        res = await fetch(url, {
            method: 'GET',
            signal: options.signal,
        })
    } catch (error) {
        throw new HttpApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Failed to reach HTTP inspector',
            details: error,
        })
    }

    let body: unknown

    try {
        body = await res.json()
    } catch {
        throw new HttpApiError({
            status: res.status,
            code: 'INVALID_JSON',
            message: 'HTTP inspector returned invalid JSON',
        })
    }

    if (!res.ok) {
        const payload = body as {
            error?: string
            message?: string
            details?: unknown
        }
        throw new HttpApiError({
            status: res.status,
            code: payload?.error ?? 'HTTP_ERROR',
            message: payload?.message ?? 'HTTP inspection failed',
            details: payload?.details ?? payload,
        })
    }

    return body as HttpInspectorResult
}
