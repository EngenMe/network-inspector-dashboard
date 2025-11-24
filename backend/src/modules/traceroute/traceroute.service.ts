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

            const hops: TracerouteHop[] = lines
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .map((line) => {
                    const parts = line.split(/\s+/);

                    const hop = parseInt(parts[0], 10);

                    if (line.includes('*')) {
                        return {
                            hop,
                            latencies: [],
                            timeout: true,
                        };
                    }

                    const ip = parts[1];

                    const latencies = parts
                        .slice(2)
                        .filter((v) => v.includes('ms'))
                        .map((v) => parseFloat(v.replace('ms', '')));

                    return {
                        hop,
                        ip,
                        latencies,
                        timeout: false,
                    };
                });

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
