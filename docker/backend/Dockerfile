FROM oven/bun:1

# install ping (iputils-ping) inside the container
RUN apt-get update \
  && apt-get install -y --no-install-recommends iputils-ping \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package.json backend/bun.lockb* ./
RUN bun install

COPY backend ./

ENV PORT=4000
EXPOSE 4000

CMD ["bun", "run", "dev"]
