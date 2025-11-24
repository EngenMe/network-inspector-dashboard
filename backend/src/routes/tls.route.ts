import type {FastifyInstance} from 'fastify'
import { tlsQuerySchema } from '../modules/tls/tls.schema'
import { getTlsInfo } from '../modules/tls/tls.service'

export default async function tlsRoute(app: FastifyInstance) {
    app.get('/tls', async (request, reply) => {
        const parsed = tlsQuerySchema.safeParse(request.query)
        if (!parsed.success) return reply.status(400).send({ error: 'INVALID_QUERY' })

        try {
            const result = await getTlsInfo({
                domain: parsed.data.domain,
                port: parsed.data.port,
            })
            return reply.send(result)
        } catch (err: any) {
            if (err.message === 'DNS_RESOLUTION_FAILED')
                return reply.status(400).send({ error: 'DNS_RESOLUTION_FAILED' })

            if (err.message === 'TLS_TIMEOUT')
                return reply.status(504).send({ error: 'TLS_TIMEOUT' })

            if (err.message === 'TLS_HANDSHAKE_FAILED')
                return reply.status(502).send({ error: 'TLS_HANDSHAKE_FAILED' })

            return reply.status(500).send({ error: 'UNKNOWN_TLS_ERROR' })
        }
    })
}
