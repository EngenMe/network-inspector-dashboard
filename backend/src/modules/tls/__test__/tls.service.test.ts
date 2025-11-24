import { describe, it, expect, vi } from 'vitest'
import tls from 'tls'
import { getTlsInfo } from '../tls.service'

vi.mock('tls', () => {
    return {
        default: {
            connect: vi.fn(),
        },
    }
})

function createSuccessSocket(cert: any) {
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

function createErrorSocket(errorCode: string) {
    return {
        once: () => {},
        on: (event: string, handler: (err: any) => void) => {
            if (event === 'error') handler({ code: errorCode })
        },
        end: () => {},
        getPeerCertificate: () => ({}),
        getProtocol: () => '',
        getCipher: () => ({ name: '' }),
    }
}

describe('TLS Service', () => {
    it('valid TLS info', async () => {
        const cert = {
                valid_from: 'Jan 1 2024',
                valid_to: 'Jan 1 2026',
                subject: { CN: 'example.com' },
                issuer: { CN: 'ExampleCA' },
                subjectaltname: 'DNS:example.com, DNS:www.example.com',
                serialNumber: '1234',
                fingerprint256: 'AA:BB:CC',
            }

        ;(tls.connect as any).mockImplementation(() => createSuccessSocket(cert))

        const res = await getTlsInfo({ domain: 'example.com', port: 443 })

        expect(res.protocol).toBe('TLSv1.3')
        expect(res.cipher).toBe('TLS_AES_256_GCM_SHA384')
        expect(res.certificate.subjectCommonName).toBe('example.com')
        expect(res.certificate.issuerCommonName).toBe('ExampleCA')
        expect(res.certificate.san).toEqual(['example.com', 'www.example.com'])
        expect(res.isExpired).toBe(false)
    })

    it('expired certificate', async () => {
        const cert = {
                valid_from: 'Jan 1 2020',
                valid_to: 'Jan 1 2021',
                subject: { CN: 'old.com' },
                issuer: { CN: 'OldCA' },
                subjectaltname: 'DNS:old.com',
                serialNumber: '999',
                fingerprint256: 'EE:FF',
            }

        ;(tls.connect as any).mockImplementation(() => createSuccessSocket(cert))

        const res = await getTlsInfo({ domain: 'old.com', port: 443 })

        expect(res.isExpired).toBe(true)
    })

    it('self-signed certificate', async () => {
        const cert = {
                valid_from: 'Jan 1 2024',
                valid_to: 'Jan 1 2026',
                subject: { CN: 'self.com' },
                issuer: { CN: 'self.com' },
                subjectaltname: 'DNS:self.com',
                serialNumber: '555',
                fingerprint256: '11:22',
            }

        ;(tls.connect as any).mockImplementation(() => createSuccessSocket(cert))

        const res = await getTlsInfo({ domain: 'self.com', port: 443 })

        expect(res.isSelfSigned).toBe(true)
    })

    it('invalid domain (DNS failure)', async () => {
        ;(tls.connect as any).mockImplementation(() =>
            createErrorSocket('ENOTFOUND')
        )

        await expect(
            getTlsInfo({ domain: 'bad.local', port: 443 })
        ).rejects.toThrow('DNS_RESOLUTION_FAILED')
    })

    it('timeout', async () => {
        ;(tls.connect as any).mockImplementation(() =>
            createErrorSocket('ETIMEDOUT')
        )

        await expect(
            getTlsInfo({ domain: 'slow.com', port: 443 })
        ).rejects.toThrow('TLS_TIMEOUT')
    })
})
