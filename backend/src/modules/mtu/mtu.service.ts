import { execAsync } from "../../utils/exec";
import { MtuInput, MtuResult } from "./mtu.types";

export class MtuService {
    async run(input: MtuInput): Promise<MtuResult> {
        const start = input.startSize ?? 1200;
        const end = input.endSize ?? 1500;
        const step = input.step ?? 10;

        const successful: number[] = [];
        const failed: number[] = [];
        const rawOutput: string[] = [];

        for (let size = start; size <= end; size += step) {
            const cmd = `ping -M do -s ${size} -c 1 ${input.target}`;
            const { stdout = "", stderr = "" } = await execAsync(cmd).catch((e) => e);

            const output = stdout + stderr;
            rawOutput.push(output);

            if (output.includes("0% packet loss")) {
                successful.push(size);
            } else {
                failed.push(size);
            }
        }

        const pathMtu = successful.length > 0 ? Math.max(...successful) : null;
        const estimatedMss = pathMtu ? pathMtu - 40 : null;

        return {
            pathMtu,
            estimatedMss,
            successfulSizes: successful,
            failedSizes: failed,
            rawOutput,
        };
    }
}
