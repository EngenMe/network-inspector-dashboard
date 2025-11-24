import { z } from 'zod';

export const tracerouteQuerySchema = z.object({
    target: z.string().trim().min(1, 'target is required'),
    maxHops: z.number().int().positive().optional(),
});

export type TracerouteQuery = z.infer<typeof tracerouteQuerySchema>;
