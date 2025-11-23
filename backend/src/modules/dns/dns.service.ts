import dns from 'node:dns/promises'
import type {
    DnsLookupResult,
    DnsRecordType,
    DnsRecords,
    MxRecord,
    SoaRecord,
} from './dns.types'

const ALL_TYPES: DnsRecordType[] = ['A', 'AAAA', 'MX', 'CNAME', 'NS', 'SOA', 'TXT']

export interface DnsServiceConfig {
    servers?: string[]
}

export class DnsService {
    constructor(config?: DnsServiceConfig) {
        if (config?.servers && config.servers.length > 0) {
            dns.setServers(config.servers)
        }
    }

    async resolveA(domain: string): Promise<string[]> {
        return dns.resolve4(domain)
    }

    async resolveAAAA(domain: string): Promise<string[]> {
        return dns.resolve6(domain)
    }

    async resolveMX(domain: string): Promise<MxRecord[]> {
        const records = await dns.resolveMx(domain)
        return records.map(r => ({ priority: r.priority, exchange: r.exchange }))
    }

    async resolveCNAME(domain: string): Promise<string[]> {
        return dns.resolveCname(domain)
    }

    async resolveNS(domain: string): Promise<string[]> {
        return dns.resolveNs(domain)
    }

    async resolveSOA(domain: string): Promise<SoaRecord | null> {
        const record = await dns.resolveSoa(domain)
        if (!record) return null
        return {
            primary: record.nsname,
            admin: record.hostmaster,
            serial: record.serial,
            refresh: record.refresh,
            retry: record.retry,
            expire: record.expire,
            minimum: record.minttl,
        }
    }

    async resolveTXT(domain: string): Promise<string[]> {
        const records = await dns.resolveTxt(domain)
        return records.map(entry => entry.join(''))
    }

    async resolveAll(
        domain: string,
        types?: DnsRecordType[],
    ): Promise<DnsLookupResult> {
        const requestedTypes = types && types.length > 0 ? types : ALL_TYPES

        const records: DnsRecords = {}

        const tasks: [DnsRecordType, Promise<unknown>][] = requestedTypes.map(t => {
            switch (t) {
                case 'A':
                    return ['A', this.resolveA(domain)]
                case 'AAAA':
                    return ['AAAA', this.resolveAAAA(domain)]
                case 'MX':
                    return ['MX', this.resolveMX(domain)]
                case 'CNAME':
                    return ['CNAME', this.resolveCNAME(domain)]
                case 'NS':
                    return ['NS', this.resolveNS(domain)]
                case 'SOA':
                    return ['SOA', this.resolveSOA(domain)]
                case 'TXT':
                    return ['TXT', this.resolveTXT(domain)]
            }
        })

        const settled = await Promise.allSettled(tasks.map(t => t[1]))

        settled.forEach((result, index) => {
            const type = tasks[index][0]
            if (result.status !== 'fulfilled') return

            switch (type) {
                case 'A':
                    records.a = result.value as string[]
                    break
                case 'AAAA':
                    records.aaaa = result.value as string[]
                    break
                case 'MX':
                    records.mx = result.value as MxRecord[]
                    break
                case 'CNAME':
                    records.cname = result.value as string[]
                    break
                case 'NS':
                    records.ns = result.value as string[]
                    break
                case 'SOA':
                    records.soa = result.value as SoaRecord | null
                    break
                case 'TXT':
                    records.txt = result.value as string[]
                    break
            }
        })

        return {
            domain,
            records,
            resolvedAt: new Date().toISOString(),
        }
    }
}

export const dnsService = new DnsService()
