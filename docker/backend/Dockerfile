FROM oven/bun:1

WORKDIR /app/backend

COPY backend/package.json backend/bun.lockb* ./
RUN bun install

COPY backend ./

ENV PORT=4000
EXPOSE 4000

CMD ["bun", "run", "dev"]
