
- A Bun + Node.js backend exposing networking APIs
- A network-tools container providing low-level tools like ping, traceroute and tcpdump
- A shared Docker network connecting all services

## 2. High-Level Diagram

    +---------------------------+         +---------------------------+
    |        Frontend           |  HTTP   |          Backend          |
    |  Next.js (Bun runtime)    +--------->  Fastify / Node / Bun     |
    |  Port 3000 (dev)          |         |  Port 4000 (API)          |
    +---------------------------+         +-------------+-------------+
                                                      |
                                                      | Docker bridge network
                                                      v
                                          +---------------------------+
                                          |      Network Tools        |
                                          |  tcpdump / ping / dig     |
                                          +---------------------------+

## 3. Monorepo Structure

    /network-inspector-dashboard
      /backend
      /frontend
      /docker
      /docs
      README.md
      docker-compose.yml

## 4. Backend Architecture

Runtime: Bun  
Framework: Fastify

Planned structure:

    /backend
      /src
        /modules
          dns/
          ping/
          traceroute/
          tls/
          http/
          docker/
        /routes
        /utils
      .env

Responsibilities:

- Implement APIs:
    - GET /api/dns
    - GET /api/ping
    - GET /api/traceroute
    - GET /api/tls
    - GET /api/http-info
    - GET /api/docker/network
- Communicate using child_process with tools like dig, ping, traceroute, openssl
- Normalize output into clean JSON

## 4.1 DNS Module

The DNS module provides all domain-related lookups used by the dashboard.  
It supports multiple record types and allows switching between the Node.js resolver and the `dig` CLI inside the `network-tools` container.

### Structure

/backend/src/modules/dns
- dns.service.ts
- dns.schema.ts
- dns.types.ts
- index.ts

### Responsibilities

- Validate incoming queries using Zod
- Resolve DNS records: A, AAAA, MX, CNAME, NS, SOA, TXT
- Support two resolution engines:
  - Node.js `dns/promises`
  - `dig` executed inside the `network-tools` container
- Normalize raw output into structured JSON
- Apply per-query timeouts
- Map resolver errors (ENOTFOUND, SERVFAIL, TIMEOUT)

### Resolution Flow
```
Frontend → GET /api/dns?domain=example.com  
↓  
Zod schema validates domain + record types  
↓  
dns.service selects resolver engine:
- Node resolver (default)
- dig (if DNS_USE_DIG=true)  
  ↓  
  Queries run with timeout + error handling  
  ↓  
  Normalized JSON returned to frontend
```

### Environment Variables

- `DNS_RESOLVER_HOST` — Custom DNS server (e.g., 8.8.8.8, 1.1.1.1, Docker DNS)
- `DNS_RESOLVER_TIMEOUT_MS` — Timeout applied to each record lookup
- `DNS_USE_DIG` — Force use of dig instead of Node resolver

### Why This Module Matters

- Ensures DNS consistency inside Docker
- Matches real network debugging tools
- Enables accurate “Local Mode” scans
- Powers the DNS card in the dashboard

## 5. Frontend Architecture

Framework: Next.js 16  
Styling: TailwindCSS + shadcn/ui  
Runtime: Bun

Structure:

    /frontend
      /app
      /components
      /lib
      tailwind.config.js

Responsibilities:

- Scan input (domain/IP)
- Show DNS, Ping, Traceroute, TLS, HTTP, Docker info
- Use charts and cards for UI
- Provide clean UX for recruiters and engineers

## 6. Docker & Networking

### Services:

- backend
- frontend
- network-tools

Same Docker network:

    networks:
      app-network:
        driver: bridge

Host access:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

Container access:

- Frontend → Backend: http://backend:4000

## 7. CI/CD

- GitHub Actions
- Bun setup
- Install dependencies
- Lint + Test backend
- Lint frontend
- Build passing badge for repo

## 8. Future Enhancements

- Typed DTOs
- zod validation
- Logging
- Rate limiting for deployment
- Advanced visualizations