import Fastify from "fastify"
import dotenv from "dotenv"
import routes from "./routes"

dotenv.config()

const app = Fastify()

app.register(routes, { prefix: "/api" })

app.get("/api/health", () => ({ status: "ok" }))

const port = Number(process.env.PORT) || 4000

app.listen({ port, host: "0.0.0.0" }).then(() => {
    console.log(`Backend listening on port ${port}`)
})
