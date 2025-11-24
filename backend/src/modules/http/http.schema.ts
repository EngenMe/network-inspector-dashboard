import { z } from "zod"

export const httpQuerySchema = z.object({
    url: z
        .string()
        .refine(
            (value) => /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+.*$/.test(value),
            "Invalid URL format"
        )
})
