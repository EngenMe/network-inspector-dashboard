import routes from "../../../routes";
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'

describe('GET /api/dns', () => {
    const app = Fastify()

    beforeAll(async () => {
        await app.register(routes, { prefix: '/api' })
    })

    afterAll(async () => {
        await app.close()
    })

    it('returns DNS records for a valid domain', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/dns?domain=example.com',
        })

        expect(res.statusCode).toBe(200)
        const body = res.json() as {
            domain: string
            records: Record<string, unknown>
            resolvedAt: string
        }

        expect(body.domain).toBe('example.com')
        expect(typeof body.resolvedAt).toBe('string')
        expect(typeof body.records).toBe('object')
    })

    it('respects types filter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/dns?domain=example.com&types=MX,NS',
        })

        expect(res.statusCode).toBe(200)
        const body = res.json() as {
            records: {
                mx?: unknown
                ns?: unknown
                a?: unknown
                aaaa?: unknown
                cname?: unknown
                soa?: unknown
                txt?: unknown
            }
        }

        expect(body.records.mx || body.records.ns).toBeDefined()
    })

    it('returns 400 for invalid domain', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/dns?domain=https://not-a-domain',
        })

        expect(res.statusCode).toBe(400)
    })
})
