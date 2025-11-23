import type { FastifyInstance } from 'fastify'
import { dnsRoutes } from './dns.route'

export default async function routes(app: FastifyInstance) {
    await app.register(dnsRoutes)
}
