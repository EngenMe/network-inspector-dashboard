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
    debug: z.string().optional(),
})

export type DnsQueryRaw = z.infer<typeof dnsQueryRawSchema>

export interface DnsQuery {
    domain: string
    types?: DnsRecordType[]
    debug?: boolean
}

export class DnsTypesValidationError extends Error {
    invalidTypes: string[]

    constructor(invalidTypes: string[]) {
        super(`Invalid DNS record types: ${invalidTypes.join(', ')}`)
        this.name = 'DnsTypesValidationError'
        this.invalidTypes = invalidTypes
    }
}

const toBoolean = (value?: string): boolean => {
    if (!value) return false
    const v = value.toLowerCase()
    return v === '1' || v === 'true' || v === 'yes' || v === 'on'
}

export const parseDnsQuery = (raw: DnsQueryRaw): DnsQuery => {
    const { domain, types, debug } = raw
    const result: DnsQuery = {
        domain,
    }

    if (types) {
        const parsed = types
            .split(',')
            .map(t => t.trim().toUpperCase())
            .filter(Boolean) as DnsRecordType[]

        if (parsed.length > 0) {
            const invalid = parsed.filter(t => !recordTypesSet.has(t))
            if (invalid.length > 0) {
                throw new DnsTypesValidationError(invalid)
            }

            result.types = Array.from(new Set(parsed))
        }
    }

    const debugFlag = toBoolean(debug)
    if (debugFlag) {
        result.debug = true
    }

    return result
}
