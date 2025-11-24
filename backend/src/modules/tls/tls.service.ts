import tls from 'tls'
import type {TlsInput, TlsInfo} from './tls.types'

export async function getTlsInfo(input: TlsInput): Promise<TlsInfo> {
    const domain = input.domain.trim()
    const port = input.port

    return new Promise((resolve, reject) => {
        const socket = tls.connect({
            host: domain,
            port,
            servername: domain,
            rejectUnauthorized: false,
            timeout: 5000,
        })

        socket.once('secureConnect', () => {
            try {
                const cert = socket.getPeerCertificate()
                const protocol = socket.getProtocol() || ''
                const cipher = socket.getCipher()?.name || ''

                const validFrom = cert.valid_from
                const validTo = cert.valid_to

                const validToDate = new Date(validTo)
                const now = new Date()
                const daysRemaining = Math.ceil(
                    (validToDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                )

                const isExpired = validToDate.getTime() < now.getTime()
                const isSelfSigned =
                    cert.issuer?.CN && cert.subject?.CN
                        ? cert.issuer.CN === cert.subject.CN
                        : false

                const san =
                    cert.subjectaltname
                        ?.replace(/DNS:/g, '')
                        .split(', ')
                        .map((s: string) => s.trim()) || []

                const result: TlsInfo = {
                    protocol,
                    cipher,
                    certificate: {
                        subjectCommonName: cert.subject?.CN || '',
                        issuerCommonName: cert.issuer?.CN || '',
                        san,
                        validFrom,
                        validTo,
                        serialNumber: cert.serialNumber || '',
                        fingerprint: cert.fingerprint256 || '',
                    },
                    daysRemaining,
                    isExpired,
                    isSelfSigned,
                }

                resolve(result)
            } catch (err) {
                reject(err)
            } finally {
                socket.end()
            }
        })

        socket.on('error', (err: any) => {
            if (err.code === 'ENOTFOUND') reject(new Error('DNS_RESOLUTION_FAILED'))
            else if (err.code === 'ETIMEDOUT') reject(new Error('TLS_TIMEOUT'))
            else reject(new Error('TLS_HANDSHAKE_FAILED'))
        })
    })
}
