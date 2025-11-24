import type { FastifyInstance } from 'fastify'
import { dnsService } from '../modules/dns'
import {
    dnsQueryRawSchema,
    parseDnsQuery,
    DnsTypesValidationError,
} from '../modules/dns/dns.schema'
import { DnsTimeoutError } from '../modules/dns/dns.service'

const mapDnsError = (error: unknown, debug: boolean) => {
    const e = error as { code?: string; message?: string; stack?: string }
    const code: string | undefined = e?.code
    const base = {
        debug: debug
            ? {
                code: code ?? 'UNKNOWN',
                message: e?.message,
                stack: e?.stack,
            }
            : undefined,
    }

    if (error instanceof DnsTimeoutError) {
        return {
            statusCode: 504,
            body: {
                error: 'DNS_TIMEOUT',
                message: 'DNS query timed out',
                ...base,
            },
        }
    }

    switch (code) {
        case 'ENOTFOUND':
            return {
                statusCode: 404,
                body: {
                    error: 'DNS_NOT_FOUND',
                    message: 'Domain not found',
                    ...base,
                },
            }
        case 'SERVFAIL':
            return {
                statusCode: 502,
                body: {
                    error: 'DNS_SERVER_FAILURE',
                    message: 'DNS server failure',
                    ...base,
                },
            }
        case 'REFUSED':
            return {
                statusCode: 502,
                body: {
                    error: 'DNS_REFUSED',
                    message: 'DNS query refused by server',
                    ...base,
                },
            }
        default:
            return {
                statusCode: 500,
                body: {
                    error: 'DNS_ERROR',
                    message: 'DNS lookup failed',
                    ...base,
                },
            }
    }
}

export async function dnsRoutes(app: FastifyInstance) {
    app.get('/dns', async (request, reply) => {
        const parseRaw = dnsQueryRawSchema.safeParse(request.query)

        if (!parseRaw.success) {
            const formatted = parseRaw.error.flatten()
            request.log.warn(
                {
                    route: '/api/dns',
                    query: request.query,
                    validationErrors: formatted,
                },
                'dns.lookup.validation_failed',
            )

            return reply.status(400).send({
                error: 'Bad Request',
                details: formatted,
            })
        }

        try {
            const query = parseDnsQuery(parseRaw.data)

            request.log.info(
                {
                    route: '/api/dns',
                    domain: query.domain,
                    types: query.types ?? 'ALL',
                    ip: request.ip,
                },
                'dns.lookup.request',
            )

            const result = await dnsService.resolveAll(query.domain, query.types, {
                timeoutMs: Number(process.env.DNS_RESOLVER_TIMEOUT_MS ?? '3000'),
            })

            request.log.info(
                {
                    route: '/api/dns',
                    domain: query.domain,
                },
                'dns.lookup.success',
            )

            return reply.send(result)
        } catch (error) {
            if (error instanceof DnsTypesValidationError) {
                request.log.warn(
                    {
                        route: '/api/dns',
                        domain: parseRaw.data.domain,
                        invalidTypes: error.invalidTypes,
                    },
                    'dns.lookup.invalid_types',
                )

                return reply.status(400).send({
                    error: 'Bad Request',
                    details: {
                        fieldErrors: {
                            types: [error.message],
                        },
                        formErrors: [],
                    },
                })
            }

            const debugFlag = parseRaw.data.debug
                ? ['1', 'true', 'yes', 'on'].includes(parseRaw.data.debug.toLowerCase())
                : false

            request.log.error(
                {
                    route: '/api/dns',
                    domain: parseRaw.data.domain,
                    error,
                },
                'dns.lookup.error',
            )

            const mapped = mapDnsError(error, debugFlag)
            return reply.status(mapped.statusCode).send(mapped.body)
        }
    })
}
