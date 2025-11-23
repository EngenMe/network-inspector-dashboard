# Setup Project – To-Do List (Using Bun for Dependency Management)

## 1. Repository & Monorepo Structure
- [ ] Create GitHub repo: `network-inspector`
- [ ] Initialize root project:
    - [ ] `git init`
    - [ ] `.gitignore` (Bun + Node + Next.js)
    - [ ] `README.md`
    - [ ] `LICENSE`
- [ ] Create monorepo structure:
    - [ ] `/frontend`
    - [ ] `/backend`
    - [ ] `/docker`
- [ ] Add shared config files:
    - [ ] `.editorconfig`
    - [ ] `prettier.config` / `.prettierrc`
    - [ ] `eslint.config` / `.eslintrc`

## 2. Backend – Initial Setup (Bun)
- [ ] Initialize backend with Bun:
    - [ ] `bun init` inside `/backend`
- [ ] Install core deps:
    - [ ] `bun add express` or `bun add fastify`
    - [ ] `bun add dotenv`
    - [ ] `bun add zod`
- [ ] Install dev deps:
    - [ ] `bun add -d typescript @types/node`
    - [ ] `bun add -d ts-node` (optional since Bun runs TS)
    - [ ] `bun add -d eslint prettier`
    - [ ] `bun add -d jest` or `bun add -d vitest`
- [ ] Create structure:
    - [ ] `/src/server.ts`
    - [ ] `/src/routes/index.ts`
    - [ ] `/src/modules/*` (dns, ping, traceroute, etc.)
    - [ ] `/src/utils/exec.ts`
- [ ] Add health route:
    - [ ] `GET /api/health` → `{ status: "ok" }`
- [ ] Add Bun scripts:
    - [ ] `"dev": "bun run src/server.ts"`
    - [ ] `"start": "bun build src/server.ts --outdir dist && bun run dist/server.js"`
    - [ ] `"test": "bun test"`

## 3. Frontend – Initial Setup (Bun)
- [ ] Create Next.js app:
    - [ ] `bun create next ./frontend`
- [ ] Install TailwindCSS:
    - [ ] `bun add -d tailwindcss postcss autoprefixer`
    - [ ] `bunx tailwindcss init -p`
- [ ] Set up shadcn/ui:
    - [ ] `bunx shadcn-ui init`
- [ ] Install UI helpers:
    - [ ] `bun add axios` (optional if using fetch)
    - [ ] `bun add zod`
- [ ] Layout setup:
    - [ ] `app/layout.tsx` (base styles)
    - [ ] `app/page.tsx` (scan input)
- [ ] Placeholder scan components:
    - [ ] DNS card
    - [ ] Ping card

## 4. Developer Experience
- [ ] Use Bun workspaces in `bunfig.toml`
- [ ] Add root scripts:
    - [ ] `"dev": "bun run backend/dev & bun run frontend/dev"`
- [ ] Shared TypeScript config:
    - [ ] `tsconfig.base.json`
- [ ] Linting + formatting:
    - [ ] Unified ESLint config for monorepo
    - [ ] Auto-format with Prettier

## 5. Docker & Environment Setup
- [ ] Create root `docker-compose.yml`:
    - [ ] `backend` container (Bun-based)
    - [ ] `frontend` container (Bun-based)
    - [ ] `network-tools` container (tcpdump, iproute2)
- [ ] Create Dockerfiles:
    - [ ] `/docker/backend/Dockerfile` (uses `oven/bun` image)
    - [ ] `/docker/frontend/Dockerfile`
- [ ] Add `.env` and `.env.example`
- [ ] Verify:
    - [ ] `docker-compose up` runs backend + frontend skeleton

## 6. CI/CD (GitHub Actions)
- [ ] Create workflow:
    - [ ] Install Bun via `oven-sh/setup-bun` action
    - [ ] Run `bun install`
    - [ ] Run `bun run lint`
    - [ ] Run `bun test`
- [ ] Add badge to README:
    - [ ] `build passing`

## 7. Documentation
- [ ] `/docs/architecture.md`
- [ ] `/docs/roadmap.md`
- [ ] Update root README:
    - [ ] Overview
    - [ ] Tech stack
    - [ ] Run locally with Bun
    - [ ] Run with Docker
- [ ] Create GitHub Issues for tracking:
    - [ ] Backend setup
    - [ ] Frontend setup
    - [ ] Docker config
    - [ ] CI pipeline
