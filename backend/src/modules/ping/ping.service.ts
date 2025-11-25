import type { PingQuery } from './ping.schema'
import type { PingResult } from './ping.types'

export class PingService {
    async run({ target, count = 4 }: PingQuery): Promise<PingResult> {
        const latencies: number[] = []
        let transmitted = 0
        let received = 0

        // simple HTTP(S) "ping" using HEAD requests
        for (let i = 0; i < count; i++) {
            transmitted += 1
            const start = (globalThis.performance?.now?.() ?? Date.now())

            try {
                // prefer HTTPS; if you want to support raw IPs without HTTPS,
                // you can add a fallback to http:// below.
                const url = target.startsWith('http://') || target.startsWith('https://')
                    ? target
                    : `https://${target}`

                await fetch(url, { method: 'HEAD' })
                const end = (globalThis.performance?.now?.() ?? Date.now())
                latencies.push(end - start)
                received += 1
            } catch {
                // treat as packet loss – do not push latency
            }
        }

        const avg =
            latencies.length > 0
                ? latencies.reduce((sum, v) => sum + v, 0) / latencies.length
                : null

        const packetLoss =
            transmitted > 0 ? Math.round(((transmitted - received) / transmitted) * 100) : null

        return {
            latencies,
            avg,
            packetLoss,
            transmitted,
            received,
        } as PingResult
    }

    // keep parse() if your tests still use it directly
    parse(output: string): PingResult {
        const latencies: number[] = []

        const latencyRegex = /time=([\d.]+)/g
        let match: RegExpExecArray | null

        while ((match = latencyRegex.exec(output)) !== null) {
            latencies.push(Number(match[1]))
        }

        const statsMatch = output.match(/= ([\d.]+)\/([\d.]+)\/([\d.]+)/)
        const avg = statsMatch ? Number(statsMatch[2]) : null

        const packetLossMatch = output.match(/(\d+)% packet loss/)
        const packetLoss = packetLossMatch ? Number(packetLossMatch[1]) : null

        return {
            latencies,
            avg,
            packetLoss,
        }
    }
}
