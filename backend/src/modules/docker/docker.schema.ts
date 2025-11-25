import { z } from "zod";

export const dockerNetworkSchema = z.object({
    networkName: z.string().optional(),
    includeStopped: z.boolean().optional()
});

export type DockerNetworkSchema = z.infer<typeof dockerNetworkSchema>;
