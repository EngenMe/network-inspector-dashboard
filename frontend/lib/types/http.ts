export interface HttpHeader {
    name: string
    value: string
}

export interface HttpRedirectHop {
    statusCode: number
    url: string
}

export interface HttpInspectorResult {
    url: string
    method: string
    statusCode: number
    statusText?: string
    protocol?: string
    ip?: string
    contentType?: string
    headers: HttpHeader[]
    redirectChain?: HttpRedirectHop[]
    resolvedAt?: string
    [key: string]: unknown
}
