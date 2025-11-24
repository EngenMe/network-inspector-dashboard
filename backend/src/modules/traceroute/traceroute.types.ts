export interface TracerouteQueryInput {
    target: string;
    maxHops?: number;
}

export interface TracerouteHop {
    hop: number;
    ip?: string;
    hostname?: string;
    latencies: number[];
    timeout: boolean;
}

export interface TracerouteResult {
    hops: TracerouteHop[];
    totalHops: number;
    notes?: string;
    error?: string;
}
