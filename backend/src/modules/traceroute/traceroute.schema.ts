import { z } from 'zod';

export const tracerouteQuerySchema = z.object({
    target: z.string(),
    maxHops: z.number().int().positive().optional(),
});

export type TracerouteQuery = z.infer<typeof tracerouteQuerySchema>;
