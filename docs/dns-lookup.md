# DNS Lookup Module

The DNS Lookup module provides detailed DNS information for any domain.  
It powers the DNS section in the Network Inspector Dashboard and supports multiple record types through a unified API.

---

## Endpoint

GET /api/dns

Example:

```
/api/dns?domain=example.com&types=A,MX,TXT
```

### Query Parameters

| Name    | Required | Description |
|---------|----------|-------------|
| domain  | yes      | Domain name to resolve |
| types   | no       | Comma-separated list of record types (default: all) |

Supported: A, AAAA, MX, CNAME, NS, SOA, TXT

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| DNS_RESOLVER_HOST        | Custom DNS server (8.8.8.8, 1.1.1.1, Docker DNS) |
| DNS_RESOLVER_TIMEOUT_MS  | Per-record timeout limit |
| DNS_USE_DIG              | Use dig instead of Node resolver |

---

## Response Format

Example:

```json
{
  "domain": "google.com",
  "records": {
    "A": ["142.250.190.46"],
    "MX": [
      { "priority": 10, "exchange": "aspmx.l.google.com" }
    ],
    "NS": ["ns1.google.com", "ns2.google.com"]
  }
}
```

---

## Error Handling

### Invalid Domain

```json
{
  "error": "Invalid domain format"
}
```

### Resolver Errors

All resolver errors are normalized to:

- DNS_ENOTFOUND
- DNS_SERVFAIL
- DNS_TIMEOUT

---

## Local Mode (Docker)

When `DNS_USE_DIG=true`, all DNS lookups are performed using `dig` inside the `network-tools` container.

Local Mode provides:

- Highly accurate resolution
- Better parity with Linux tools
- Consistent results across environments

---

## Demo Examples

### 1. Resolve google.com

```
/api/dns?domain=google.com
```

### 2. Resolve example.com with filters

```
/api/dns?domain=example.com&types=A,MX,TXT
```

### 3. Invalid domain test

```
/api/dns?domain=abc@@@.com
```

Results will show a structured error response.

---

## Purpose

This module forms the foundation of the Networking Dashboard by delivering reliable DNS data, supporting both high-level UI visualization and low-level troubleshooting using Docker-backed tools.