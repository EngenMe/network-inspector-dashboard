# MTU/MSS Module – To-Do List

## 1. Module Structure
- [ ] Create `/src/modules/mtu` directory
- [ ] Add files:
    - [ ] `mtu.schema.ts`
    - [ ] `mtu.types.ts`
    - [ ] `mtu.service.ts`
    - [ ] `index.ts`
    - [ ] `__test__/mtu.service.test.ts`
    - [ ] `__test__/mtu.route.test.ts`

## 2. Zod Schema
- [ ] Create query schema:
    - [ ] `target` (domain or IP)
    - [ ] `startSize` (optional)
    - [ ] `endSize` (optional)
    - [ ] `step` (optional)

## 3. Types
- [ ] Define input type:
    - [ ] `target`
    - [ ] `startSize`
    - [ ] `endSize`
    - [ ] `step`
- [ ] Define output type:
    - [ ] `pathMtu`
    - [ ] `estimatedMss`
    - [ ] `successfulSizes`
    - [ ] `failedSizes`
    - [ ] `rawOutput`

## 4. Service Logic
- [ ] Use `exec.ts` to run MTU/MSS check with `ping -M do -s <size> <target>`
- [ ] Loop from `startSize` to `endSize` using `step`
- [ ] Track successful and failed sizes
- [ ] Calculate:
    - [ ] Largest successful size → `pathMtu`
    - [ ] `estimatedMss = pathMtu - 40`
- [ ] Return structured data using `mtu.types`

## 5. Route
- [ ] Create `/src/routes/mtu.route.ts`
- [ ] Implement:
    - [ ] `GET /api/mtu-mss?target=...`
    - [ ] Validate query with `mtu.schema`
    - [ ] Call service
    - [ ] Map service errors to standardized responses

## 6. Tests

### Service Tests
- [ ] Mock `exec` outputs
- [ ] Test cases:
    - [ ] Normal case with clear MTU
    - [ ] All sizes fail
    - [ ] Mixed success and failure pattern
- [ ] Assert:
    - [ ] Correct `pathMtu`
    - [ ] Correct `estimatedMss`
    - [ ] Accurate classification of success/failure arrays

### Route Tests
- [ ] Test:
    - [ ] Successful response
    - [ ] Missing target
    - [ ] Invalid target
    - [ ] Error mapping

## 7. Integration
- [ ] Register route in `/src/routes/index.ts`
- [ ] Add minimal docs to `README`:
    - [ ] Endpoint usage
    - [ ] Query params
    - [ ] Example JSON output
