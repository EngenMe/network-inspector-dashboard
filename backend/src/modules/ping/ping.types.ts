export interface PingResult {
    latencies: number[];
    avg: number | null;
    packetLoss: number | null;
}
