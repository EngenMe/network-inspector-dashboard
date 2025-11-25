export interface PingStatsLike {
    transmitted?: number
    received?: number
    loss?: number
    packetLoss?: number
    min?: number
    max?: number
    avg?: number
    minRttMs?: number
    maxRttMs?: number
    avgRttMs?: number
}

export interface PingResult {
    target?: string
    ip?: string
    resolvedAt?: string
    stats?: PingStatsLike
    probes?: Array<{
        seq?: number
        success?: boolean
        timeMs?: number
    }>
    // backend may return additional fields
    [key: string]: unknown
}
