import type { FastifyInstance } from 'fastify'
import { dnsService } from '../modules/dns'
import {
    dnsQueryRawSchema,
    parseDnsQuery,
    DnsTypesValidationError,
} from '../modules/dns/dns.schema'

export async function dnsRoutes(app: FastifyInstance) {
    app.get('/api/dns', async (request, reply) => {
        const parseRaw = dnsQueryRawSchema.safeParse(request.query)

        if (!parseRaw.success) {
            const formatted = parseRaw.error.flatten()
            return reply.status(400).send({
                error: 'Bad Request',
                details: formatted,
            })
        }

        try {
            const query = parseDnsQuery(parseRaw.data)
            const result = await dnsService.resolveAll(query.domain, query.types)
            return reply.send(result)
        } catch (error) {
            if (error instanceof DnsTypesValidationError) {
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

            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'DNS lookup failed',
            })
        }
    })
}
