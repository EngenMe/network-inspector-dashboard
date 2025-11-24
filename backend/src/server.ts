import Fastify from "fastify"
import cors from '@fastify/cors'
import dotenv from "dotenv"
import routes from "./routes"

dotenv.config()

const app = Fastify({
    logger: true, //todo: change to be if env is dev
})

const frontendPort =
    process.env.FRONTEND_PORT ??
    process.env.NEXT_PUBLIC_FRONTEND_PORT ??
    '3000'

await app.register(cors, {
    origin: `http://localhost:${frontendPort}`,
})
app.register(routes, { prefix: "/api" })

app.get("/api/health", () => ({ status: "ok" }))

const port = Number(process.env.PORT) || 4000

app.listen({ port, host: "0.0.0.0" }).then(() => {
    console.log(`Backend listening on port ${port}`)
})
