import type { FastifyInstance } from 'fastify'
import tracerouteRoute from "./traceroute.route";
import { dnsRoutes } from './dns.route'
import pingRoutes from "./ping.route";

export default async function routes(app: FastifyInstance) {
    await app.register(dnsRoutes);
    await app.register(pingRoutes);
    await app.register(tracerouteRoute);
}
