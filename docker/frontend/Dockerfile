FROM oven/bun:1

WORKDIR /app/frontend

COPY frontend/package.json frontend/bun.lockb* ./
RUN bun install

COPY frontend ./

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "dev"]
