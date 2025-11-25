import { z } from "zod";

export const mtuQuerySchema = z.object({
    target: z.string().min(1),
    startSize: z.coerce.number().optional(),
    endSize: z.coerce.number().optional(),
    step: z.coerce.number().optional(),
});

export type MtuQueryInput = z.infer<typeof mtuQuerySchema>;
