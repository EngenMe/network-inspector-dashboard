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
    defaultTimeoutMs?: number
}

export class DnsTimeoutError extends Error {
    code = 'TIMEOUT'
    label: string
    timeoutMs: number

    constructor(label: string, timeoutMs: number) {
        super(`Timeout while resolving ${label} after ${timeoutMs}ms`)
        this.name = 'DnsTimeoutError'
        this.label = label
        this.timeoutMs = timeoutMs
    }
}

export class DnsService {
    private readonly defaultTimeoutMs: number

    constructor(config?: DnsServiceConfig) {
        if (config?.servers && config.servers.length > 0) {
            dns.setServers(config.servers)
        }
        this.defaultTimeoutMs = config?.defaultTimeoutMs ?? 3000
    }

    private withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string) {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new DnsTimeoutError(label, timeoutMs))
            }, timeoutMs)

            promise
                .then(value => {
                    clearTimeout(timer)
                    resolve(value)
                })
                .catch(err => {
                    clearTimeout(timer)
                    reject(err)
                })
        })
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
        options?: { timeoutMs?: number },
    ): Promise<DnsLookupResult> {
        const requestedTypes = types && types.length > 0 ? types : ALL_TYPES
        const records: DnsRecords = {}
        const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs

        const tasks: [DnsRecordType, Promise<unknown>][] = requestedTypes.map(t => {
            switch (t) {
                case 'A':
                    return ['A', this.withTimeout(this.resolveA(domain), timeoutMs, 'A')]
                case 'AAAA':
                    return ['AAAA', this.withTimeout(this.resolveAAAA(domain), timeoutMs, 'AAAA')]
                case 'MX':
                    return ['MX', this.withTimeout(this.resolveMX(domain), timeoutMs, 'MX')]
                case 'CNAME':
                    return ['CNAME', this.withTimeout(this.resolveCNAME(domain), timeoutMs, 'CNAME')]
                case 'NS':
                    return ['NS', this.withTimeout(this.resolveNS(domain), timeoutMs, 'NS')]
                case 'SOA':
                    return ['SOA', this.withTimeout(this.resolveSOA(domain), timeoutMs, 'SOA')]
                case 'TXT':
                    return ['TXT', this.withTimeout(this.resolveTXT(domain), timeoutMs, 'TXT')]
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

        if (
            !records.a &&
            !records.aaaa &&
            !records.mx &&
            !records.cname &&
            !records.ns &&
            !records.soa &&
            !records.txt
        ) {
            throw new Error('DNS resolution failed for all record types')
        }

        return {
            domain,
            records,
            resolvedAt: new Date().toISOString(),
        }
    }
}

export const dnsService = new DnsService({
    defaultTimeoutMs: Number(process.env.DNS_RESOLVER_TIMEOUT_MS ?? '3000'),
})
