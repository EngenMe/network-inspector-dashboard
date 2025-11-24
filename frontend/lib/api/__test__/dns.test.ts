import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchDns, ApiError } from '../dns'
import type { DnsLookupResult } from '@/lib/types/dns'

const mockFetch = vi.fn()

describe('fetchDns', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        globalThis.fetch = mockFetch
    })

    it('returns parsed DNS result on success', async () => {
        const payload: DnsLookupResult = {
            domain: 'example.com',
            resolvedAt: new Date().toISOString(),
            records: { a: ['1.1.1.1'] },
        }

        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => payload,
        })

        const result = await fetchDns('example.com')
        expect(result).toEqual(payload)
        expect(mockFetch).toHaveBeenCalled()
    })

    it('throws ApiError on HTTP error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: 'DNS_NOT_FOUND', message: 'Domain not found' }),
        })

        await expect(fetchDns('missing.example.com')).rejects.toBeInstanceOf(ApiError)
    })

    it('throws ApiError on network failure', async () => {
        mockFetch.mockRejectedValue(new Error('network down'))

        await expect(fetchDns('example.com')).rejects.toBeInstanceOf(ApiError)
    })
})
