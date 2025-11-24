# Traceroute Module – To-Do List

## 1. Module Structure
- [ ] Ensure `/src/modules/traceroute` directory exists
- [ ] Add files:
    - [ ] `traceroute.schema.ts`
    - [ ] `traceroute.types.ts`
    - [ ] `traceroute.service.ts`
    - [ ] `index.ts`
    - [ ] `__test__/traceroute.service.test.ts`
    - [ ] `__test__/traceroute.route.test.ts`

## 2. Zod Schema
- [ ] Create query schema:
    - [ ] `target` (domain or IP) – required
    - [ ] Optional: `maxHops` (maximum number of hops)

## 3. Types
- [ ] Define input type:
    - [ ] `target`
    - [ ] Optional `maxHops`
- [ ] Define output types:
    - [ ] `TracerouteHop` (hop number, IP, optional hostname, latencies array, timeout flag)
    - [ ] `TracerouteResult` (hops array, total hops, optional notes/error message)

## 4. Service Logic
- [ ] Use `exec.ts` to run system traceroute command:
    - [ ] Linux: `traceroute -n <target>`
    - [ ] If `maxHops` provided: `traceroute -n -m <maxHops> <target>`
- [ ] Parse command output:
    - [ ] Extract hop number
    - [ ] Extract IP address
    - [ ] Extract per-hop latencies
    - [ ] Detect timeouts (`*`)
- [ ] Normalize into `TracerouteResult` shape
- [ ] Map command errors to internal error types

## 5. Route
- [ ] Add new route file in `/src/routes`:
    - [ ] `traceroute.route.ts`
    - [ ] `GET /api/traceroute?target=...`
    - [ ] Validate query with `traceroute.schema`
    - [ ] Call `traceroute.service`
    - [ ] Map service errors to standardized HTTP responses

## 6. Tests
### Service Tests
- [ ] Mock `exec` output
- [ ] Test:
    - [ ] Successful traceroute with multiple hops
    - [ ] Hops with timeouts (`*`)
    - [ ] Unreachable target / no route
    - [ ] Invalid domain / exec error mapping

### Route Tests
- [ ] Test:
    - [ ] Successful traceroute request
    - [ ] Missing `target` query param
    - [ ] Invalid `target` format
    - [ ] Command error mapped to correct HTTP status

## 7. Integration
- [ ] Register traceroute route in `/src/routes/index.ts`
- [ ] Add minimal documentation to backend `README`:
    - [ ] Endpoint description
    - [ ] Query params
    - [ ] Example request and JSON response
