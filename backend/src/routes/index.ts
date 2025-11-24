import type { FastifyInstance } from 'fastify'
import httpRoute from "./http.route.ts";
import tlsRoute from "./tls.route.ts";
import tracerouteRoute from "./traceroute.route";
import { dnsRoutes } from './dns.route'
import pingRoutes from "./ping.route";

export default async function routes(app: FastifyInstance) {
    await app.register(dnsRoutes);
    await app.register(pingRoutes);
    await app.register(tracerouteRoute);
    await tlsRoute(app);
    await httpRoute(app)
}
