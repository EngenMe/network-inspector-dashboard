export type HttpInput = {
    url: string
}

export type HttpOutput = {
    finalUrl: string
    statusCode: number
    statusText: string
    protocol: string
    headers: Record<string, string>
}
