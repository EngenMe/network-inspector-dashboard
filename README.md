![CI](https://github.com/engenme/network-inspector-dashboard/actions/workflows/ci.yml/badge.svg)
# 🌐 Network Inspector Dashboard

A full-stack networking analysis toolkit that provides real-time diagnostics for any domain or IP address.

This project showcases advanced backend engineering, networking fundamentals, Docker containerization, and a modern frontend experience, all organized in a Bun-based monorepo.

## 🚀 Overview

Network Inspector Dashboard allows deep network inspections through a clean and intuitive UI.

Enter any domain or IP and instantly view:

- DNS records
- Ping latency
- Traceroute hops
- TLS and HTTPS certificate details
- HTTP headers and protocol info
- MTU and MSS behavior
- Common port scan
- Docker container network visualization

Designed for learning, debugging, and demonstrating backend, networking, and DevOps capabilities.

## 🧩 Features

### Core Networking Tools
- DNS Lookup for A, AAAA, MX, CNAME, NS, SOA
- Ping with latency and packet loss
- Traceroute visualization
- TLS inspector for certificate chain and cipher suite
- HTTP inspector for headers and status info
- MTU and MSS testing
- Common port scanning

### Advanced Tools
- Docker network mapping with bridges and containers
- Packet capture using tcpdump in Local Mode
- Reverse proxy detection including Nginx and Cloudflare
- SNI and ALPN inspection

## 🏗️ Tech Stack

### Frontend
- Next.js 14
- TailwindCSS
- shadcn ui
- React Charts

### Backend
- Bun Runtime
- Node.js
- Fastify
- child_process networking utilities
- Docker SDK

### DevOps
- Docker and Docker Compose
- Nginx
- GitHub Actions

## 🗂️ Monorepo Structure

    /network-inspector
      /frontend     Next.js dashboard
      /backend      Networking API using Bun
      /docker       Network tools and Dockerfiles

## 📡 API Endpoints

    GET /api/dns?domain=
    GET /api/ping?target=
    GET /api/traceroute?target=
    GET /api/tls?domain=
    GET /api/http-info?url=
    GET /api/docker/network

## 🧪 Local Development

### Install Bun
    https://bun.sh

### Install dependencies
    bun install

### Start both apps
    bun run dev

### Start backend only
    bun run backend/dev

### Start frontend only
    bun run frontend/dev

## 🐳 Run With Docker

### Build and start all services
    docker-compose up --build

This starts the backend, frontend, and the network-tools container that includes tcpdump and iproute2.

## 🔧 Scripts

Available through Bun workspaces in bunfig.toml

### Common commands
    bun run dev
    bun run lint
    bun test

## 📅 Roadmap

### Week 1
DNS lookup, ping, basic UI

### Week 2
Traceroute, TLS, HTTP inspector, dashboard layout

### Week 3
Docker integration and network visualization

### Week 4
MTU and MSS tests, polishing, deployment, demo recording

## 📘 Documentation

- docs architecture
- docs roadmap
- docker configuration
- module documentation

## 🛡️ License

MIT License

## ✨ Author

Mohamed Farouk Hasnaoui EngenMe
Full Stack Developer, Networking Enthusiast, DevOps Learner
