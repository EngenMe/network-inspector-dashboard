export type DnsRecordType = 'A' | 'AAAA' | 'MX' | 'CNAME' | 'NS' | 'SOA' | 'TXT'

export type ARecord = string
export type AAAARecord = string

export interface MxRecord {
    priority: number
    exchange: string
}

export type CnameRecord = string
export type NsRecord = string

export interface SoaRecord {
    primary: string
    admin: string
    serial: number
    refresh: number
    retry: number
    expire: number
    minimum: number
}

export type TxtRecord = string

export interface DnsRecords {
    a?: ARecord[]
    aaaa?: AAAARecord[]
    mx?: MxRecord[]
    cname?: CnameRecord[]
    ns?: NsRecord[]
    soa?: SoaRecord | null
    txt?: TxtRecord[]
}

export interface DnsLookupResult {
    domain: string
    records: DnsRecords
    resolvedAt: string
}
