FROM oven/bun:1

# Install network tools we depend on
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       iputils-ping \
       traceroute \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package.json backend/bun.lockb* ./
RUN bun install

COPY backend ./

ENV PORT=4000
EXPOSE 4000

CMD ["bun", "run", "dev"]
