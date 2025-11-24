# TLS Inspector Module – To-Do List

## 1. Module Structure
- [ ] Ensure `/src/modules/tls` directory exists
- [ ] Add files:
    - [ ] `tls.schema.ts`
    - [ ] `tls.types.ts`
    - [ ] `tls.service.ts`
    - [ ] `index.ts`
    - [ ] `__test__/tls.service.test.ts`
    - [ ] `__test__/tls.route.test.ts`

## 2. Zod Schema
- [ ] Create query schema:
    - [ ] `domain` (required)
    - [ ] `port` optional (default: 443)
- [ ] Add constraints:
    - [ ] `domain` non-empty
    - [ ] `port` 1–65535

## 3. Types
- [ ] Define input:
    - [ ] `domain`
    - [ ] `port`
- [ ] Define output:
    - [ ] `protocol`
    - [ ] `cipher`
    - [ ] `certificate`:
        - [ ] `subjectCommonName`
        - [ ] `issuerCommonName`
        - [ ] `san`
        - [ ] `validFrom`
        - [ ] `validTo`
        - [ ] `serialNumber`
        - [ ] `fingerprint`
    - [ ] Derived:
        - [ ] `daysRemaining`
        - [ ] `isExpired`
        - [ ] `isSelfSigned`

## 4. Service Logic
- [ ] Implement `getTlsInfo`:
    - [ ] Normalize input
    - [ ] Connect using Node `tls` module or `exec`
    - [ ] Parse:
        - [ ] protocol
        - [ ] cipher
        - [ ] certificate fields
    - [ ] Compute:
        - [ ] expiration days
        - [ ] expired flag
        - [ ] self-signed flag
    - [ ] Map errors:
        - [ ] DNS failure
        - [ ] timeout
        - [ ] handshake error
- [ ] Return structured JSON

## 5. Route
- [ ] Create `/src/routes/tls.route.ts`:
    - [ ] `GET /api/tls?domain=&port=`
    - [ ] Validate with `tls.schema`
    - [ ] Call service
    - [ ] Map errors to HTTP responses
- [ ] Register in `/src/routes/index.ts`

## 6. Tests

### Service Tests
- [ ] Mock TLS output
- [ ] Test:
    - [ ] valid TLS info
    - [ ] expired cert
    - [ ] self-signed cert
    - [ ] invalid domain
    - [ ] timeout
    - [ ] parsing robustness

### Route Tests
- [ ] Test:
    - [ ] success with default port
    - [ ] success with custom port
    - [ ] missing domain
    - [ ] invalid domain
    - [ ] service error mapping

## 7. Integration
- [ ] Add TLS docs to backend `README.md`:
    - [ ] Endpoint usage
    - [ ] Sample response
