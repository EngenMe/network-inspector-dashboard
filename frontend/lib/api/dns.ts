import type {
    DnsLookupResult,
    DnsRecordType,
    NormalizedApiError,
} from '../types/dns'

const backendPort =
    process.env.NEXT_PUBLIC_BACKEND_PORT ??
    process.env.BACKEND_PORT ??
    '4000'

const defaultBaseUrl = `http://localhost:${backendPort}`

export class ApiError extends Error implements NormalizedApiError {
    status: number
    code: string
    details?: unknown

    constructor(init: NormalizedApiError) {
        super(init.message)
        this.name = 'ApiError'
        this.status = init.status
        this.code = init.code
        this.details = init.details
    }
}

export interface FetchDnsOptions {
    types?: DnsRecordType[]
    debug?: boolean
    baseUrl?: string
    signal?: AbortSignal
}

export const fetchDns = async (
    domain: string,
    options: FetchDnsOptions = {},
): Promise<DnsLookupResult> => {
    const baseUrl = options.baseUrl ?? defaultBaseUrl

    const params = new URLSearchParams()
    params.set('domain', domain)

    if (options.types?.length) {
        params.set('types', options.types.join(','))
    }

    if (options.debug) {
        params.set('debug', '1')
    }

    const url = `${baseUrl}/api/dns?${params.toString()}`

    let res: Response

    try {
        res = await fetch(url, {
            method: 'GET',
            signal: options.signal,
        })
    } catch (error) {
        throw new ApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Failed to reach DNS service',
            details: error,
        })
    }

    let body: unknown

    try {
        body = await res.json()
    } catch {
        throw new ApiError({
            status: res.status,
            code: 'INVALID_JSON',
            message: 'Server returned invalid JSON',
        })
    }

    if (!res.ok) {
        const payload = body as any
        throw new ApiError({
            status: res.status,
            code: payload?.error ?? 'DNS_ERROR',
            message: payload?.message ?? 'DNS lookup failed',
            details: payload?.details ?? payload,
        })
    }

    return body as DnsLookupResult
}
