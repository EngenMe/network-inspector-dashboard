import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as dns from 'node:dns/promises'
import type { MxRecord, SoaRecord } from '../dns.types'
import { DnsService } from '../dns.service'

vi.mock('node:dns/promises', () => ({
    default: {
        resolve4: vi.fn(),
        resolve6: vi.fn(),
        resolveMx: vi.fn(),
        resolveCname: vi.fn(),
        resolveNs: vi.fn(),
        resolveSoa: vi.fn(),
        resolveTxt: vi.fn(),
        setServers: vi.fn(),
    },
}))

type DnsMock = {
    resolve4: ReturnType<typeof vi.fn>
    resolve6: ReturnType<typeof vi.fn>
    resolveMx: ReturnType<typeof vi.fn>
    resolveCname: ReturnType<typeof vi.fn>
    resolveNs: ReturnType<typeof vi.fn>
    resolveSoa: ReturnType<typeof vi.fn>
    resolveTxt: ReturnType<typeof vi.fn>
    setServers: ReturnType<typeof vi.fn>
}

// @ts-ignore
const dnsMock = dns.default as unknown as DnsMock

describe('DnsService', () => {
    let service: DnsService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new DnsService({ defaultTimeoutMs: 5000 })
    })

    it('resolves A records', async () => {
        dnsMock.resolve4.mockResolvedValue(['1.1.1.1'])
        const result = await service.resolveA('example.com')
        expect(dnsMock.resolve4).toHaveBeenCalledWith('example.com')
        expect(result).toEqual(['1.1.1.1'])
    })

    it('resolves AAAA records', async () => {
        dnsMock.resolve6.mockResolvedValue(['::1'])
        const result = await service.resolveAAAA('example.com')
        expect(dnsMock.resolve6).toHaveBeenCalledWith('example.com')
        expect(result).toEqual(['::1'])
    })

    it('resolves MX records', async () => {
        const mx: MxRecord[] = [
            { priority: 10, exchange: 'mail.example.com' },
            { priority: 20, exchange: 'backup.example.com' },
        ]
        dnsMock.resolveMx.mockResolvedValue(mx)
        const result = await service.resolveMX('example.com')
        expect(dnsMock.resolveMx).toHaveBeenCalledWith('example.com')
        expect(result).toEqual(mx)
    })

    it('resolves CNAME records', async () => {
        dnsMock.resolveCname.mockResolvedValue(['alias.example.com'])
        const result = await service.resolveCNAME('www.example.com')
        expect(dnsMock.resolveCname).toHaveBeenCalledWith('www.example.com')
        expect(result).toEqual(['alias.example.com'])
    })

    it('resolves NS records', async () => {
        dnsMock.resolveNs.mockResolvedValue(['ns1.example.com', 'ns2.example.com'])
        const result = await service.resolveNS('example.com')
        expect(dnsMock.resolveNs).toHaveBeenCalledWith('example.com')
        expect(result).toEqual(['ns1.example.com', 'ns2.example.com'])
    })

    it('resolves SOA records', async () => {
        const soa: SoaRecord = {
            primary: 'ns1.example.com',
            admin: 'hostmaster.example.com',
            serial: 1,
            refresh: 2,
            retry: 3,
            expire: 4,
            minimum: 5,
        }
        dnsMock.resolveSoa.mockResolvedValue({
            nsname: soa.primary,
            hostmaster: soa.admin,
            serial: soa.serial,
            refresh: soa.refresh,
            retry: soa.retry,
            expire: soa.expire,
            minttl: soa.minimum,
        })
        const result = await service.resolveSOA('example.com')
        expect(dnsMock.resolveSoa).toHaveBeenCalledWith('example.com')
        expect(result).toEqual(soa)
    })

    it('resolves TXT records', async () => {
        dnsMock.resolveTxt.mockResolvedValue([['v=spf1'], ['some', 'chunked', 'txt']])
        const result = await service.resolveTXT('example.com')
        expect(dnsMock.resolveTxt).toHaveBeenCalledWith('example.com')
        expect(result).toEqual(['v=spf1', 'somechunkedtxt'])
    })

    it('resolveAll aggregates records', async () => {
        dnsMock.resolve4.mockResolvedValue(['1.1.1.1'])
        dnsMock.resolve6.mockResolvedValue(['::1'])
        dnsMock.resolveMx.mockResolvedValue([
            { priority: 10, exchange: 'mail.example.com' },
        ])
        dnsMock.resolveCname.mockResolvedValue(['alias.example.com'])
        dnsMock.resolveNs.mockResolvedValue(['ns1.example.com'])
        dnsMock.resolveSoa.mockResolvedValue({
            nsname: 'ns1.example.com',
            hostmaster: 'hostmaster.example.com',
            serial: 1,
            refresh: 2,
            retry: 3,
            expire: 4,
            minttl: 5,
        })
        dnsMock.resolveTxt.mockResolvedValue([['v=spf1']])

        const result = await service.resolveAll('example.com', [
            'A',
            'AAAA',
            'MX',
            'CNAME',
            'NS',
            'SOA',
            'TXT',
        ])

        expect(result.domain).toBe('example.com')
        expect(result.records.a).toEqual(['1.1.1.1'])
        expect(result.records.aaaa).toEqual(['::1'])
        expect(result.records.mx).toEqual([{ priority: 10, exchange: 'mail.example.com' }])
        expect(result.records.cname).toEqual(['alias.example.com'])
        expect(result.records.ns).toEqual(['ns1.example.com'])
        expect(result.records.soa).toEqual({
            primary: 'ns1.example.com',
            admin: 'hostmaster.example.com',
            serial: 1,
            refresh: 2,
            retry: 3,
            expire: 4,
            minimum: 5,
        })
        expect(result.records.txt).toEqual(['v=spf1'])
    })
})
