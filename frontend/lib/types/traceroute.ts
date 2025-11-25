export interface TracerouteHop {
    hop: number
    ip?: string
    host?: string
    rttMs?: number[]
    loss?: number | null
}

export interface TracerouteResult {
    target?: string
    resolvedAt?: string
    hops: TracerouteHop[]
    [key: string]: unknown
}
