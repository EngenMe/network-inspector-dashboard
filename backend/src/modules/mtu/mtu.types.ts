export interface MtuInput {
    target: string;
    startSize?: number;
    endSize?: number;
    step?: number;
}

export interface MtuResult {
    pathMtu: number | null;
    estimatedMss: number | null;
    successfulSizes: number[];
    failedSizes: number[];
    rawOutput: string[];
}
