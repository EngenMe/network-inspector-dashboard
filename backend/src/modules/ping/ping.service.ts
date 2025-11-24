import { execAsync } from "../../utils/exec";
import type {PingResult} from "./ping.types";
import type {PingQuery} from "./ping.schema";

export class PingService {
    async run({ target, count = 4 }: PingQuery): Promise<PingResult> {
        const command = `ping -c ${count} ${target}`;
        const { stdout } = await execAsync(command);

        return this.parse(stdout);
    }

    parse(output: string): PingResult {
        return {
            latencies: [],
            avg: null,
            packetLoss: null,
        };
    }
}
