import { execAsync } from "../../utils/exec";
import type {PingQuery} from "./ping.schema";
import type {PingResult} from "./ping.types";

export class PingService {
    async run({ target, count = 4 }: PingQuery): Promise<PingResult> {
        const command = `ping -c ${count} ${target}`;
        const { stdout } = await execAsync(command);

        return this.parse(stdout);
    }

    parse(output: string): PingResult {
        const latencies: number[] = [];

        const latencyRegex = /time=([\d.]+)/g;
        let match: RegExpExecArray | null;

        while ((match = latencyRegex.exec(output)) !== null) {
            latencies.push(Number(match[1]));
        }

        const statsMatch = output.match(/= ([\d.]+)\/([\d.]+)\/([\d.]+)/);
        const avg = statsMatch ? Number(statsMatch[2]) : null;

        const packetLossMatch = output.match(/(\d+)% packet loss/);
        const packetLoss = packetLossMatch ? Number(packetLossMatch[1]) : null;

        return {
            latencies,
            avg,
            packetLoss,
        };
    }
}
