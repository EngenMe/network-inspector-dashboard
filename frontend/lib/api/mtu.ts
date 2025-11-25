import type { MtuResult } from '../types/mtu'
import type { NormalizedApiError } from '../types/dns'

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export class MtuApiError extends Error implements NormalizedApiError {
    status: number
    code: string
    details?: unknown

    constructor(init: NormalizedApiError) {
        super(init.message)
        this.name = 'MtuApiError'
        this.status = init.status
        this.code = init.code
        this.details = init.details
    }
}

export interface FetchMtuOptions {
    debug?: boolean
    baseUrl?: string
    signal?: AbortSignal
}

export const fetchMtu = async (
    target: string,
    options: FetchMtuOptions = {},
): Promise<MtuResult> => {
    const baseUrl = options.baseUrl ?? defaultBaseUrl

    const params = new URLSearchParams()
    params.set('target', target)
    if (options.debug) params.set('debug', '1')

    const url = `${baseUrl}/api/mtu-mss?${params.toString()}`

    let res: Response

    try {
        res = await fetch(url, {
            method: 'GET',
            signal: options.signal,
        })
    } catch (error) {
        throw new MtuApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Failed to reach MTU/MSS service',
            details: error,
        })
    }

    let body: unknown

    try {
        body = await res.json()
    } catch {
        throw new MtuApiError({
            status: res.status,
            code: 'INVALID_JSON',
            message: 'MTU/MSS service returned invalid JSON',
        })
    }

    if (!res.ok) {
        const payload = body as {
            error?: string
            message?: string
            details?: unknown
        }
        throw new MtuApiError({
            status: res.status,
            code: payload?.error ?? 'MTU_ERROR',
            message: payload?.message ?? 'MTU/MSS test failed',
            details: payload?.details ?? payload,
        })
    }

    return body as MtuResult
}
