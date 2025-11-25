import type { PingResult } from '../types/ping'
import type { NormalizedApiError } from '../types/dns' // reuse same shape

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export class PingApiError extends Error implements NormalizedApiError {
    status: number
    code: string
    details?: unknown

    constructor(init: NormalizedApiError) {
        super(init.message)
        this.name = 'PingApiError'
        this.status = init.status
        this.code = init.code
        this.details = init.details
    }
}

export interface FetchPingOptions {
    debug?: boolean
    baseUrl?: string
    signal?: AbortSignal
}

export const fetchPing = async (
    target: string,
    options: FetchPingOptions = {},
): Promise<PingResult> => {
    const baseUrl = options.baseUrl ?? defaultBaseUrl

    const params = new URLSearchParams()
    params.set('target', target)
    if (options.debug) params.set('debug', '1')

    const url = `${baseUrl}/api/ping?${params.toString()}`

    let res: Response

    try {
        res = await fetch(url, {
            method: 'GET',
            signal: options.signal,
        })
    } catch (error) {
        throw new PingApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Failed to reach ping service',
            details: error,
        })
    }

    let body: unknown

    try {
        body = await res.json()
    } catch {
        throw new PingApiError({
            status: res.status,
            code: 'INVALID_JSON',
            message: 'Ping service returned invalid JSON',
        })
    }

    if (!res.ok) {
        const payload = body as {
            error?: string
            message?: string
            details?: unknown
        }
        throw new PingApiError({
            status: res.status,
            code: payload?.error ?? 'PING_ERROR',
            message: payload?.message ?? 'Ping failed',
            details: payload?.details ?? payload,
        })
    }

    return body as PingResult
}
