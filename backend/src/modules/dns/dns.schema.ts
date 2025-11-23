import { z } from 'zod'
import type { DnsRecordType } from './dns.types'

const recordTypes = ['A', 'AAAA', 'MX', 'CNAME', 'NS', 'SOA', 'TXT'] as const
const recordTypesSet = new Set(recordTypes)

const domainRegex =
    /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.?$/

export const dnsQueryRawSchema = z.object({
    domain: z
        .string()
        .trim()
        .min(1, 'Domain is required')
        .max(253, 'Domain is too long')
        .regex(domainRegex, 'Invalid domain format'),
    types: z.string().optional(),
})

export type DnsQueryRaw = z.infer<typeof dnsQueryRawSchema>

export interface DnsQuery {
    domain: string
    types?: DnsRecordType[]
}

export class DnsTypesValidationError extends Error {
    invalidTypes: string[]

    constructor(invalidTypes: string[]) {
        super(`Invalid DNS record types: ${invalidTypes.join(', ')}`)
        this.name = 'DnsTypesValidationError'
        this.invalidTypes = invalidTypes
    }
}

export const parseDnsQuery = (raw: DnsQueryRaw): DnsQuery => {
    const { domain, types } = raw

    if (!types) {
        return { domain }
    }

    const parsed = types
        .split(',')
        .map(t => t.trim().toUpperCase())
        .filter(Boolean) as DnsRecordType[]

    if (parsed.length === 0) {
        return { domain }
    }

    const invalid = parsed.filter(t => !recordTypesSet.has(t))
    if (invalid.length > 0) {
        throw new DnsTypesValidationError(invalid)
    }

    const unique = Array.from(new Set(parsed))

    return { domain, types: unique }
}
