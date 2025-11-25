import type { FastifyInstance } from 'fastify'
import httpRoute from "./http.route.ts";
import tlsRoute from "./tls.route.ts";
import tracerouteRoute from "./traceroute.route";
import { dnsRoutes } from './dns.route'
import pingRoutes from "./ping.route";
import dockerRoute from "./docker.route";

export default async function routes(app: FastifyInstance) {
    await app.register(dnsRoutes);
    await app.register(pingRoutes);
    await app.register(tracerouteRoute);
    await app.register(dockerRoute);
    await tlsRoute(app);
    await httpRoute(app);
}
