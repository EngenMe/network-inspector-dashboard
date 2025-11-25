import { FastifyInstance } from "fastify";
import { dockerNetworkSchema } from "../modules/docker/docker.schema";
import { dockerService } from "../modules/docker/docker.service";

export default async function dockerRoute(app: FastifyInstance) {
    app.get("/api/docker/network", async (req, reply) => {
        const parseResult = dockerNetworkSchema.safeParse(req.query);

        if (!parseResult.success) {
            return reply.status(400).send({
                error: "Invalid query parameters",
                details: parseResult.error.flatten()
            });
        }

        try {
            const data = await dockerService.getNetworkMap(parseResult.data);
            return reply.send(data);
        } catch {
            return reply.status(500).send({
                error: "Docker network inspection failed"
            });
        }
    });
}
