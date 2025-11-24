import { z } from "zod";

export const PingQuerySchema = z.object({
    target: z
        .string()
        .min(1)
        .regex(
            /^[a-zA-Z0-9.-]+$/,
            "Invalid target format"
        ),
    count: z
        .number()
        .int()
        .min(1)
        .max(10)
        .optional(),
});

export type PingQuery = z.infer<typeof PingQuerySchema>;
