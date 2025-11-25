export interface TlsInspectorResult {
    domain?: string
    resolvedIp?: string
    resolvedAt?: string

    protocol?: string
    cipherSuite?: string
    alpn?: string | null

    issuer?: string
    subject?: string
    validFrom?: string
    validTo?: string
    san?: string[]

    [key: string]: unknown
}
