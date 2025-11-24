# Ping Module – To-Do List

## 1. Module Structure
- [ ] Create `/src/modules/ping` directory
- [ ] Add files:
    - [ ] `ping.schema.ts`
    - [ ] `ping.types.ts`
    - [ ] `ping.service.ts`
    - [ ] `index.ts`
    - [ ] `__test__/ping.service.test.ts`
    - [ ] `__test__/ping.route.test.ts`

## 2. Zod Schema
- [ ] Create query schema:
    - [ ] `target` (domain or IP)
    - [ ] Optional: `count` (number of packets)

## 3. Types
- [ ] Define:
    - [ ] Input type
    - [ ] Output type (latency array, avg latency, packet loss)

## 4. Service Logic
- [ ] Use `exec.ts` to run system ping command:
    - [ ] Linux/macOS: `ping -c 4 <target>`
- [ ] Parse output:
    - [ ] Individual latencies
    - [ ] Packet loss
    - [ ] Min/avg/max
- [ ] Return structured JSON

## 5. Route
- [ ] Add new route file in `/src/routes`:
    - [ ] `GET /api/ping?target=...`
    - [ ] Validate with `ping.schema`
    - [ ] Call service
    - [ ] Map errors to standardized responses

## 6. Tests
### Service Tests
- [ ] Mock `exec` output
- [ ] Test:
    - [ ] Valid parse
    - [ ] No response
    - [ ] Invalid domain
    - [ ] Packet-loss cases

### Route Tests
- [ ] Test:
    - [ ] Successful ping
    - [ ] Missing query param
    - [ ] Invalid target
    - [ ] Command error mapping

## 7. Integration
- [ ] Register route in `/src/routes/index.ts`
- [ ] Add minimal documentation to backend `README`:
    - [ ] Usage example
    - [ ] Expected output
