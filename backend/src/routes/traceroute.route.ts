import type {FastifyInstance} from 'fastify';
import { tracerouteQuerySchema } from '../modules/traceroute/traceroute.schema';
import { TracerouteService } from '../modules/traceroute/traceroute.service';

export default async function tracerouteRoute(app: FastifyInstance) {
    app.get('/traceroute', async (request, reply) => {
        const parse = tracerouteQuerySchema.safeParse(request.query);

        if (!parse.success) {
            return reply.status(400).send({
                error: 'Invalid query parameters',
                details: parse.error.format(),
            });
        }

        const result = await TracerouteService.run(parse.data);

        if (result.error) {
            return reply.status(500).send({
                error: 'Traceroute failed',
                details: result.error,
            });
        }

        return reply.send(result);
    });
}
