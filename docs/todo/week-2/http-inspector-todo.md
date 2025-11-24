# HTTP Inspector Module – To-Do List

## 1. Module Structure
- [ ] Create `/src/modules/http` directory (if not existing)
- [ ] Add files:
    - [ ] `http.schema.ts`
    - [ ] `http.types.ts`
    - [ ] `http.service.ts`
    - [ ] `index.ts`
    - [ ] `__test__/http.service.test.ts`
    - [ ] `__test__/http.route.test.ts`

## 2. Zod Schema
- [ ] Create query schema:
    - [ ] `url` (required)
    - [ ] Validate correct `http://` or `https://` format

## 3. Types
- [ ] Define:
    - [ ] Input type
    - [ ] Output type including:
        - [ ] Final URL
        - [ ] HTTP status code
        - [ ] Status text
        - [ ] Protocol version
        - [ ] Response headers object

## 4. Service Logic
- [ ] Implement `http.service.ts`:
    - [ ] Normalize input URL
    - [ ] Perform GET request to target
    - [ ] Extract:
        - [ ] Final URL after redirects
        - [ ] Status code
        - [ ] Status text
        - [ ] HTTP version
        - [ ] Headers
    - [ ] Map low-level errors to service errors
    - [ ] Return structured output

## 5. Route
- [ ] Add `/src/routes/http.route.ts`:
    - [ ] `GET /api/http-info?url=...`
    - [ ] Validate with `http.schema`
    - [ ] Call service
    - [ ] Map errors to standardized API responses

## 6. Tests

### Service Tests
- [ ] Mock HTTP request
- [ ] Test:
    - [ ] Valid URL
    - [ ] Invalid URL format
    - [ ] DNS/network errors
    - [ ] Non-2xx responses

### Route Tests
- [ ] Test:
    - [ ] Successful request
    - [ ] Missing `url`
    - [ ] Invalid `url`
    - [ ] Error mapping

## 7. Integration
- [ ] Register route in `/src/routes/index.ts`
- [ ] Update backend `README`:
    - [ ] Endpoint usage
    - [ ] Example response
