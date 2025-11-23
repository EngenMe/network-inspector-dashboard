
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