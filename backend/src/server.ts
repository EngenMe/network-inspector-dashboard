import Fastify from "fastify"
import dotenv from "dotenv"
import routes from "./routes"

dotenv.config()

const app = Fastify()

app.register(routes, { prefix: "/api" })

app.get("/api/health", () => ({ status: "ok" }))

app.listen({ port: Number(process.env.PORT) || 4000 }, () => {})
