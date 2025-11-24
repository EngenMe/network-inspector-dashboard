import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import tls from 'tls'
import tlsRoute from '../../../routes/tls.route'

vi.mock('tls', () => {
    return {
        default: {
            connect: vi.fn(),
        },
    }
})

function mockSocket(cert: any) {
    return {
        once: (event: string, handler: () => void) => {
            if (event === 'secureConnect') handler()
        },
        on: () => {},
        end: () => {},
        getPeerCertificate: () => cert,
        getProtocol: () => 'TLSv1.3',
        getCipher: () => ({ name: 'TLS_AES_256_GCM_SHA384' }),
    }
}

async function createApp() {
    const app = Fastify()
    await app.register(tlsRoute, { prefix: '/api' })
    return app
}

describe('TLS Route', () => {
    it('success with default port', async () => {
        const app = await createApp()

        const cert = {
                valid_from: 'Jan 1 2024',
                valid_to: 'Jan 1 2026',
                subject: { CN: 'example.com' },
                issuer: { CN: 'ExampleCA' },
                subjectaltname: 'DNS:example.com',
                serialNumber: '111',
                fingerprint256: 'AA:BB',
            }

        ;(tls.connect as any).mockImplementation(() => mockSocket(cert))

        const res = await app.inject({
            method: 'GET',
            url: '/api/tls?domain=example.com',
        })

        expect(res.statusCode).toBe(200)
    })

    it('success with custom port', async () => {
        const app = await createApp()

        ;(tls.connect as any).mockImplementation(() =>
            mockSocket({
                valid_from: 'Jan 1 2024',
                valid_to: 'Jan 1 2026',
                subject: { CN: 'test.com' },
                issuer: { CN: 'ExampleCA' },
                subjectaltname: 'DNS:test.com',
                serialNumber: '222',
                fingerprint256: 'CC:DD',
            })
        )

        const res = await app.inject({
            method: 'GET',
            url: '/api/tls?domain=test.com&port=8443',
        })

        expect(res.statusCode).toBe(200)
    })

    it('missing domain', async () => {
        const app = await createApp()

        const res = await app.inject({
            method: 'GET',
            url: '/api/tls',
        })

        expect(res.statusCode).toBe(400)
    })

    it('invalid domain', async () => {
        const app = await createApp()

        const res = await app.inject({
            method: 'GET',
            url: '/api/tls?domain=',
        })

        expect(res.statusCode).toBe(400)
    })

    it('service error mapping', async () => {
        const app = await createApp()

        ;(tls.connect as any).mockImplementation(() => ({
            once: () => {},
            on: (event: string, handler: (err: any) => void) => {
                if (event === 'error') handler({ code: 'ECONNRESET' })
            },
            end: () => {},
            getPeerCertificate: () => ({}),
            getProtocol: () => '',
            getCipher: () => ({ name: '' }),
        }))

        const res = await app.inject({
            method: 'GET',
            url: '/api/tls?domain=fail.com',
        })

        expect(res.statusCode).toBe(502)
    })
})
