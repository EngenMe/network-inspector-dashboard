export interface MtuProbe {
    size: number
    success: boolean
    error?: string
}

export interface MtuResult {
    target: string
    mtu?: number | null
    mss?: number | null
    probes?: MtuProbe[]
    raw?: string
    resolvedAt?: string
    [key: string]: unknown
}
