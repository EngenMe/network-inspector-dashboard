import type { TracerouteResult } from '../types/traceroute'
import type { NormalizedApiError } from '../types/dns'

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export class TracerouteApiError extends Error implements NormalizedApiError {
    status: number
    code: string
    details?: unknown

    constructor(init: NormalizedApiError) {
        super(init.message)
        this.name = 'TracerouteApiError'
        this.status = init.status
        this.code = init.code
        this.details = init.details
    }
}

export interface FetchTracerouteOptions {
    debug?: boolean
    baseUrl?: string
    signal?: AbortSignal
}

export const fetchTraceroute = async (
    target: string,
    options: FetchTracerouteOptions = {},
): Promise<TracerouteResult> => {
    const baseUrl = options.baseUrl ?? defaultBaseUrl

    const params = new URLSearchParams()
    params.set('target', target)
    if (options.debug) params.set('debug', '1')

    const url = `${baseUrl}/api/traceroute?${params.toString()}`

    let res: Response

    try {
        res = await fetch(url, {
            method: 'GET',
            signal: options.signal,
        })
    } catch (error) {
        throw new TracerouteApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Failed to reach traceroute service',
            details: error,
        })
    }

    let body: unknown

    try {
        body = await res.json()
    } catch {
        throw new TracerouteApiError({
            status: res.status,
            code: 'INVALID_JSON',
            message: 'Traceroute service returned invalid JSON',
        })
    }

    if (!res.ok) {
        const payload = body as {
            error?: string
            message?: string
            details?: unknown
        }
        throw new TracerouteApiError({
            status: res.status,
            code: payload?.error ?? 'TRACEROUTE_ERROR',
            message: payload?.message ?? 'Traceroute failed',
            details: payload?.details ?? payload,
        })
    }

    return body as TracerouteResult
}
