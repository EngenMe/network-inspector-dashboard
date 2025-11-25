import type { TlsInspectorResult } from '../types/tls'
import type { NormalizedApiError } from '../types/dns'

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export class TlsApiError extends Error implements NormalizedApiError {
    status: number
    code: string
    details?: unknown

    constructor(init: NormalizedApiError) {
        super(init.message)
        this.name = 'TlsApiError'
        this.status = init.status
        this.code = init.code
        this.details = init.details
    }
}

export interface FetchTlsOptions {
    debug?: boolean
    baseUrl?: string
    signal?: AbortSignal
}

export const fetchTls = async (
    domain: string,
    options: FetchTlsOptions = {},
): Promise<TlsInspectorResult> => {
    const baseUrl = options.baseUrl ?? defaultBaseUrl

    const params = new URLSearchParams()
    params.set('domain', domain)
    if (options.debug) params.set('debug', '1')

    const url = `${baseUrl}/api/tls?${params.toString()}`

    let res: Response

    try {
        res = await fetch(url, {
            method: 'GET',
            signal: options.signal,
        })
    } catch (error) {
        throw new TlsApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Failed to reach TLS inspector',
            details: error,
        })
    }

    let body: unknown

    try {
        body = await res.json()
    } catch {
        throw new TlsApiError({
            status: res.status,
            code: 'INVALID_JSON',
            message: 'TLS inspector returned invalid JSON',
        })
    }

    if (!res.ok) {
        const payload = body as {
            error?: string
            message?: string
            details?: unknown
        }
        throw new TlsApiError({
            status: res.status,
            code: payload?.error ?? 'TLS_ERROR',
            message: payload?.message ?? 'TLS inspection failed',
            details: payload?.details ?? payload,
        })
    }

    return body as TlsInspectorResult
}
