import { z } from "zod"

export const httpQuerySchema = z.object({
    url: z.string().url()
})
