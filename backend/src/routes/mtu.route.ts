import { FastifyInstance } from "fastify";
import { mtuQuerySchema } from "../modules/mtu/mtu.schema";
import { MtuService } from "../modules/mtu/mtu.service";

export default async function mtuRoute(app: FastifyInstance) {
    const service = new MtuService();

    app.get("/api/mtu-mss", {
        schema: { querystring: mtuQuerySchema },
        handler: async (req, reply) => {
            try {
                const data = await service.run(req.query as any);
                return reply.send(data);
            } catch {
                return reply.status(500).send({ error: "MTU test failed" });
            }
        },
    });
}
