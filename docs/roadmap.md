# Network Inspector Dashboard – Roadmap

## Milestone 1 – Core Setup

- [x] Monorepo setup
- [x] Backend Bun + Fastify
- [x] Frontend Next.js + Tailwind
- [x] Docker Compose
- [x] GitHub Actions

## Milestone 2 – Networking Features

### DNS Module
- [ ] GET /api/dns
- [ ] A, AAAA, MX, CNAME, NS, SOA support
- [ ] Normalize dig output

### Ping Module
- [ ] GET /api/ping
- [ ] Latency, loss, min/avg/max
- [ ] Prepare chart format

### Traceroute Module
- [ ] GET /api/traceroute
- [ ] Hop list, RTT, hostname
- [ ] Hop visualization structure

## Milestone 3 – TLS & HTTP

### TLS
- [ ] GET /api/tls
- [ ] Cert chain, expiry, issuer
- [ ] Protocol + cipher suite

### HTTP
- [ ] GET /api/http-info
- [ ] Headers, status, protocol
- [ ] Handle redirects

## Milestone 4 – Docker Networking

- [ ] Docker network map
- [ ] GET /api/docker/network
- [ ] Container graph
- [ ] Bridges, links
- [ ] Optional local-mode packet capture

## Milestone 5 – UI & UX

- [ ] Dashboard layout
- [ ] DNS card
- [ ] Ping chart
- [ ] Traceroute map
- [ ] TLS card
- [ ] HTTP card
- [ ] Dark mode

## Milestone 6 – Hardening & Polish

- [ ] zod validation
- [ ] Timeout handling
- [ ] Error structure
- [ ] Improved logging
- [ ] README screenshots
- [ ] Demo video