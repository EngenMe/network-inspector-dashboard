# Docker Network Integration – To-Do List

## 1. Module Structure
- [ ] Ensure `/src/modules/docker` directory exists
- [ ] Add files:
    - [ ] `docker.schema.ts`
    - [ ] `docker.types.ts`
    - [ ] `docker.service.ts`
    - [ ] `index.ts`
    - [ ] `__test__/docker.service.test.ts`
    - [ ] `__test__/docker.route.test.ts`

## 2. Zod Schema
- [ ] Create query schema for `GET /api/docker/network`:
    - [ ] No required query params
    - [ ] Optional future params: `networkName`, `includeStopped`

## 3. Types
- [ ] Define input type
- [ ] Define node type:
    - [ ] `id`
    - [ ] `name`
    - [ ] `type` (`container` | `network`)
    - [ ] Optional fields: `image`, `state`, `ipAddress`
- [ ] Define link type:
    - [ ] `sourceId`
    - [ ] `targetId`
    - [ ] `relation`
- [ ] Define output type:
    - [ ] `nodes` array
    - [ ] `links` array

## 4. Service Logic
- [ ] Create Docker SDK client (`/var/run/docker.sock`)
- [ ] Fetch Docker networks
- [ ] For each network fetch connected containers
- [ ] Build graph:
    - [ ] Add network nodes
    - [ ] Add container nodes
    - [ ] Add edges linking containers → networks
- [ ] Normalize result to output type
- [ ] Handle errors:
    - [ ] Socket unavailable
    - [ ] Permission issues
    - [ ] Empty data cases
- [ ] Return structured JSON

## 5. Route
- [ ] Create `docker.route.ts`
- [ ] Add route:
    - [ ] `GET /api/docker/network`
- [ ] Validate query with schema
- [ ] Call service
- [ ] Map errors to standardized responses

## 6. Tests

### Service Tests
- [ ] Mock Docker client
- [ ] Test:
    - [ ] Single network + container
    - [ ] Multiple networks/containers
    - [ ] No networks / no containers
    - [ ] Docker unavailable
    - [ ] Permission errors

### Route Tests
- [ ] Test:
    - [ ] Successful network graph
    - [ ] Docker unavailable handling
    - [ ] Invalid query params
    - [ ] Error mapping

## 7. Integration
- [ ] Export in `/src/modules/docker/index.ts`
- [ ] Register in `/src/routes/index.ts`
- [ ] Add docs to backend `README`:
    - [ ] Endpoint description
    - [ ] Usage example
    - [ ] Example response structure
