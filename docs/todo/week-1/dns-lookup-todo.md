# DNS Lookup – To-Do List

## 1. Backend – DNS Lookup Module
- [ ] Create module folder:
    - [ ] `/backend/src/modules/dns/`
- [ ] Implement resolver service:
    - [ ] `dns.service.ts` using `node:dns/promises` or `child_process`
    - [ ] Support: A, AAAA, MX, CNAME, NS, SOA, TXT
- [ ] Define types:
    - [ ] `DnsRecordType` union
    - [ ] Structured response types
- [ ] Implement resolvers:
    - [ ] `resolveA(domain)`
    - [ ] `resolveAAAA(domain)`
    - [ ] `resolveMX(domain)`
    - [ ] `resolveCNAME(domain)`
    - [ ] `resolveNS(domain)`
    - [ ] `resolveSOA(domain)`
    - [ ] `resolveTXT(domain)`
- [ ] Add aggregator:
    - [ ] `resolveAll(domain, options?)`

## 2. Backend – Validation & Routing
- [ ] Create Zod schema:
    - [ ] `/backend/src/modules/dns/dns.schema.ts`
    - [ ] Validate domain + optional types[]
- [ ] Create route:
    - [ ] `/backend/src/routes/dns.route.ts`
    - [ ] Register inside `/routes/index.ts`
- [ ] Implement endpoint:
    - [ ] `GET /api/dns?domain=&types=A,MX`
- [ ] Error responses:
    - [ ] 400 for invalid input

## 3. Backend – Error Handling & Observability
- [ ] Normalize DNS errors:
    - [ ] Map ENOTFOUND, SERVFAIL, TIMEOUT
- [ ] Logging:
    - [ ] Log domain + record types
- [ ] Timeouts:
    - [ ] Per-query timeout + partial results
- [ ] Config:
    - [ ] Custom DNS server option
    - [ ] Toggle dig vs dns.promises

## 4. Frontend – API Client & Types
- [ ] Shared types:
    - [ ] `/frontend/lib/types/dns.ts`
- [ ] API client:
    - [ ] `/frontend/lib/api/dns.ts`
    - [ ] `fetchDns(domain, types?)`
- [ ] Normalize fetch errors

## 5. Frontend – DNS Card UI
- [ ] Create card:
    - [ ] `/frontend/components/dns/dns-card.tsx`
- [ ] Layout:
    - [ ] Tabs/accordions per record type
    - [ ] Table/list for values
- [ ] UX:
    - [ ] Skeleton loading
    - [ ] Error state
    - [ ] Copy-to-clipboard
    - [ ] Badges for record types

## 6. Frontend – Integration with Scan Flow
- [ ] Hook into main scan page
- [ ] Store results in state
- [ ] Record type selector
- [ ] Toggle raw JSON
- [ ] Prevent stale response flashes

## 7. Testing

### Backend
- [ ] Unit tests:
    - [ ] Each resolver
    - [ ] Error mapping
- [ ] Integration tests:
    - [ ] `GET /api/dns`
    - [ ] Test domain filters + payload shape

### Frontend
- [ ] Component tests:
    - [ ] Loading, success, empty, error
- [ ] API tests:
    - [ ] Mock fetch

## 8. Docker & Local Mode
- [ ] Validate DNS inside backend container
- [ ] Install `dig` in network-tools image
- [ ] Add ENV:
    - [ ] `DNS_RESOLVER_HOST`
    - [ ] `DNS_RESOLVER_TIMEOUT_MS`
    - [ ] `DNS_USE_DIG`

## 9. Documentation & Demo
- [ ] `/docs/architecture.md` section for DNS module
- [ ] Add `/docs/dns-lookup.md`
- [ ] Update README with screenshots
- [ ] Demo script:
    - [ ] Resolve google.com + example.com
    - [ ] Record filtering
    - [ ] Invalid domain example
