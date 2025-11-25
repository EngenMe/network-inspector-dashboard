import { z } from "zod";

export const dockerNetworkSchema = z.object({});
export type DockerNetworkSchema = z.infer<typeof dockerNetworkSchema>;