export type TlsInput = {
    domain: string
    port: number
}

export type TlsCertificateInfo = {
    subjectCommonName: string
    issuerCommonName: string
    san: string[]
    validFrom: string
    validTo: string
    serialNumber: string
    fingerprint: string
}

export type TlsInfo = {
    protocol: string
    cipher: string
    certificate: TlsCertificateInfo
    daysRemaining: number
    isExpired: boolean
    isSelfSigned: boolean
}
