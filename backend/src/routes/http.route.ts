import type {FastifyInstance} from "fastify"
import { httpQuerySchema, httpService, HttpServiceError } from "../modules/http"

export const registerHttpRoute = async (fastify: FastifyInstance) => {
    fastify.get("/http-info", async (request, reply) => {
        const parsed = httpQuerySchema.safeParse(request.query)

        if (!parsed.success) {
            return reply.status(400).send({
                error: "INVALID_QUERY",
                message: "Invalid query parameters",
                details: parsed.error.flatten()
            })
        }

        try {
            const result = await httpService(parsed.data)
            return reply.send(result)
        } catch (error) {
            if (error instanceof HttpServiceError) {
                const statusCode = error.code === "TIMEOUT" ? 504 : 502

                return reply.status(statusCode).send({
                    error: error.code,
                    message: error.message
                })
            }

            request.log.error({ err: error }, "Unexpected http inspector error")

            return reply.status(500).send({
                error: "INTERNAL_SERVER_ERROR",
                message: "Unexpected error while processing HTTP inspector request"
            })
        }
    })
}

export default registerHttpRoute
