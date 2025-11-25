import { FastifyInstance } from "fastify";
import { mtuQuerySchema } from "../modules/mtu/mtu.schema";
import { MtuService } from "../modules/mtu/mtu.service";

export default async function mtuRoute(app: FastifyInstance) {
    const service = new MtuService();

    app.get("/mtu-mss", async (req, reply) => {
        const parseResult = mtuQuerySchema.safeParse(req.query);

        if (!parseResult.success) {
            return reply.status(400).send({ error: "Invalid query" });
        }

        try {
            const data = await service.run(parseResult.data);
            return reply.send(data);
        } catch {
            return reply.status(500).send({ error: "MTU test failed" });
        }
    });
}
