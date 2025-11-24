import { z } from 'zod'

export const tlsQuerySchema = z.object({
    domain: z.string().trim().min(1),
    port: z.coerce.number().int().min(1).max(65535).optional().default(443),
})

export type TlsQueryInput = z.infer<typeof tlsQuerySchema>
