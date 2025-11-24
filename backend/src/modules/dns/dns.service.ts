import dns from "node:dns/promises"
import type {
    DnsLookupResult,
    DnsRecordType,
    DnsRecords,
    MxRecord,
    SoaRecord,
} from "./dns.types"

const ALL_TYPES: DnsRecordType[] = [
    "A",
    "AAAA",
    "MX",
    "CNAME",
    "NS",
    "SOA",
    "TXT",
]

const USE_DIG = process.env.DNS_USE_DIG === "1"
const RESOLVER_HOST = process.env.DNS_RESOLVER_HOST ?? null

export interface DnsServiceConfig {
    servers?: string[]
    defaultTimeoutMs?: number
}

export class DnsTimeoutError extends Error {
    code = "TIMEOUT"
    label: string
    timeoutMs: number

    constructor(label: string, timeoutMs: number) {
        super(`Timeout while resolving ${label} after ${timeoutMs}ms`)
        this.name = "DnsTimeoutError"
        this.label = label
        this.timeoutMs = timeoutMs
    }
}

export class DnsService {
    private readonly defaultTimeoutMs: number

    constructor(config?: DnsServiceConfig) {
        if (!USE_DIG) {
            if (RESOLVER_HOST) {
                dns.setServers([RESOLVER_HOST])
            } else if (config?.servers?.length) {
                dns.setServers(config.servers)
            }
        }

        this.defaultTimeoutMs = config?.defaultTimeoutMs ?? 3000
    }

    private withTimeout<T>(
        promise: Promise<T>,
        timeoutMs: number,
        label: string,
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(
                () => reject(new DnsTimeoutError(label, timeoutMs)),
                timeoutMs,
            )

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

    // ---------------------
    // Resolve Methods
    // ---------------------

    private resolveA = (domain: string): Promise<string[]> => dns.resolve4(domain)

    private resolveAAAA = (domain: string): Promise<string[]> =>
        dns.resolve6(domain)

    private resolveMX = async (domain: string): Promise<MxRecord[]> => {
        const records = await dns.resolveMx(domain)
        return records.map(r => ({ priority: r.priority, exchange: r.exchange }))
    }

    private resolveCNAME = (domain: string): Promise<string[]> =>
        dns.resolveCname(domain)

    private resolveNS = (domain: string): Promise<string[]> => dns.resolveNs(domain)

    private resolveSOA = async (domain: string): Promise<SoaRecord | null> => {
        const r = await dns.resolveSoa(domain)
        return r
            ? {
                primary: r.nsname,
                admin: r.hostmaster,
                serial: r.serial,
                refresh: r.refresh,
                retry: r.retry,
                expire: r.expire,
                minimum: r.minttl,
            }
            : null
    }

    private resolveTXT = async (domain: string): Promise<string[]> => {
        const entries = await dns.resolveTxt(domain)
        return entries.map(x => x.join(""))
    }

    // ---------------------------------------
    // Main Resolver
    // ---------------------------------------

    async resolveAll(
        domain: string,
        types?: DnsRecordType[],
        options?: { timeoutMs?: number },
    ): Promise<DnsLookupResult> {
        const selected = types?.length ? types : ALL_TYPES
        const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs

        const resolvers: Record<DnsRecordType, () => Promise<unknown>> = {
            A: () => this.resolveA(domain),
            AAAA: () => this.resolveAAAA(domain),
            MX: () => this.resolveMX(domain),
            CNAME: () => this.resolveCNAME(domain),
            NS: () => this.resolveNS(domain),
            SOA: () => this.resolveSOA(domain),
            TXT: () => this.resolveTXT(domain),
        }

        const tasks = selected.map(type => [
            type,
            this.withTimeout(resolvers[type](), timeoutMs, type),
        ]) as [DnsRecordType, Promise<unknown>][]

        const results = await Promise.allSettled(tasks.map(t => t[1]))

        const records: DnsRecords = {}

        results.forEach((res, i) => {
            const type = tasks[i][0]
            if (res.status !== "fulfilled") return

            switch (type) {
                case "A":
                    records.a = res.value as string[]
                    break
                case "AAAA":
                    records.aaaa = res.value as string[]
                    break
                case "MX":
                    records.mx = res.value as MxRecord[]
                    break
                case "CNAME":
                    records.cname = res.value as string[]
                    break
                case "NS":
                    records.ns = res.value as string[]
                    break
                case "SOA":
                    records.soa = res.value as SoaRecord | null
                    break
                case "TXT":
                    records.txt = res.value as string[]
                    break
            }
        })

        const noResults =
            !records.a &&
            !records.aaaa &&
            !records.mx &&
            !records.cname &&
            !records.ns &&
            !records.soa &&
            !records.txt

        if (noResults) {
            throw new Error("DNS resolution failed for all record types")
        }

        return {
            domain,
            records,
            resolvedAt: new Date().toISOString(),
        }
    }
}

export const dnsService = new DnsService({
    defaultTimeoutMs: Number(process.env.DNS_RESOLVER_TIMEOUT_MS ?? "3000"),
})
