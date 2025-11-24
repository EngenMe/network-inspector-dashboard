import type {FastifyInstance} from "fastify";
import { PingQuerySchema } from "../modules/ping/ping.schema";
import { PingService } from "../modules/ping/ping.service";

export default async function pingRoutes(app: FastifyInstance) {
    const service = new PingService();

    app.get("/ping", async (req, reply) => {
        const parseResult = PingQuerySchema.safeParse(req.query);

        if (!parseResult.success) {
            return reply.status(400).send({
                error: "Invalid query parameters",
                details: parseResult.error.flatten(),
            });
        }

        try {
            const result = await service.run(parseResult.data);
            return reply.send(result);
        } catch (err) {
            return reply.status(500).send({
                error: "Ping execution failed",
                message: err instanceof Error ? err.message : "Unknown error",
            });
        }
    });
}
