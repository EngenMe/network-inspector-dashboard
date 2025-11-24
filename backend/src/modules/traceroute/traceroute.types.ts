export interface TracerouteHop {
    hop: number;
    ip?: string;
    latencies: number[];
    timeout: boolean;
}

export interface TracerouteResult {
    hops: TracerouteHop[];
    totalHops: number;
}
