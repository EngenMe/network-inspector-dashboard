import { z } from "zod";

export const PingQuerySchema = z.object({
    target: z.string().min(1),
    count: z.number().int().positive().optional(),
});

export type PingQuery = z.infer<typeof PingQuerySchema>;
