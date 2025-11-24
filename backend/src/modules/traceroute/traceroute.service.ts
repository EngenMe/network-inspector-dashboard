import { execAsync } from '../../utils/exec';
import type {TracerouteQuery} from './traceroute.schema';
import type {TracerouteHop, TracerouteResult} from './traceroute.types';

export class TracerouteService {
    static async run(query: TracerouteQuery): Promise<TracerouteResult> {
        const { target, maxHops } = query;

        const cmd = maxHops
            ? `traceroute -n -m ${maxHops} ${target}`
            : `traceroute -n ${target}`;

        try {
            const { stdout } = await execAsync(cmd);
            const lines = stdout.split('\n').slice(1);

            const hops: TracerouteHop[] = [];

            for (const rawLine of lines) {
                const line = rawLine.trim();
                if (!line) continue;

                const parts = line.split(/\s+/);
                const hopNumber = Number.parseInt(parts[0], 10);

                if (!Number.isFinite(hopNumber)) {
                    continue;
                }

                if (line.includes('*')) {
                    hops.push({
                        hop: hopNumber,
                        latencies: [],
                        timeout: true,
                    });
                    continue;
                }

                const ip = parts[1];

                const latencies = parts
                    .slice(2)
                    .filter((v) => v.includes('ms'))
                    .map((v) => Number.parseFloat(v.replace('ms', '')));

                hops.push({
                    hop: hopNumber,
                    ip,
                    latencies,
                    timeout: false,
                });
            }

            return {
                hops,
                totalHops: hops.length,
            };
        } catch (err: any) {
            return {
                hops: [],
                totalHops: 0,
                error: err?.message ?? 'Traceroute failed',
            };
        }
    }
}
