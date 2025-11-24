import { describe, it, expect } from 'vitest'
import { mapDnsError } from '../dns.route'
import { DnsTimeoutError } from '../../modules/dns/dns.service'

describe('mapDnsError', () => {
    it('maps timeout to 504', () => {
        const err = new DnsTimeoutError('A', 1000)
        const mapped = mapDnsError(err, false)
        expect(mapped.statusCode).toBe(504)
        expect(mapped.body.error).toBe('DNS_TIMEOUT')
    })

    it('maps ENOTFOUND to 404', () => {
        const err = { code: 'ENOTFOUND', message: 'not found' }
        const mapped = mapDnsError(err, false)
        expect(mapped.statusCode).toBe(404)
        expect(mapped.body.error).toBe('DNS_NOT_FOUND')
    })

    it('maps SERVFAIL to 502', () => {
        const err = { code: 'SERVFAIL', message: 'fail' }
        const mapped = mapDnsError(err, false)
        expect(mapped.statusCode).toBe(502)
        expect(mapped.body.error).toBe('DNS_SERVER_FAILURE')
    })

    it('maps REFUSED to 502', () => {
        const err = { code: 'REFUSED', message: 'refused' }
        const mapped = mapDnsError(err, false)
        expect(mapped.statusCode).toBe(502)
        expect(mapped.body.error).toBe('DNS_REFUSED')
    })

    it('includes debug block when debug=true', () => {
        const err = { code: 'ENOTFOUND', message: 'x', stack: 'stack' }
        const mapped = mapDnsError(err, true)
        expect(mapped.body.debug).toBeDefined()
        // @ts-ignore
        expect(mapped.body.debug.code).toBe('ENOTFOUND')
    })
})
