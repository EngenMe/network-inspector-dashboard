# Network Inspector Dashboard – Backend

Backend service for the **Network Inspector Dashboard**, providing DNS Lookup, Ping, Traceroute, TLS Inspection, HTTP Metadata, and Docker Network Mapping.

Built with **Bun**, **Fastify**, and modular networking tools.

---

## Installation

```bash
bun install
```

## Run the Server

```bash
bun run index.ts
```

---

## Ping Endpoint

### Route

```
GET /api/ping?target=<domain-or-ip>&count=<optional>
```

### Query Parameters

| Param  | Type   | Required | Description              |
|--------|--------|----------|--------------------------|
| target | string | yes      | Domain or IP to ping     |
| count  | number | no       | Packet count (default 4) |

### Usage Example

```
GET http://localhost:4000/api/ping?target=8.8.8.8
```

### Expected Output

```json
{
  "latencies": [23.1, 24.5, 25.0, 22.8],
  "avg": 23.85,
  "packetLoss": 0
}
```

---

## Traceroute Endpoint

### Route

```
GET /api/traceroute?target=<domain-or-ip>&maxHops=<optional>
```

### Query Parameters

| Param   | Type   | Required | Description           |
|---------|--------|----------|-----------------------|
| target  | string | yes      | Domain/IP to trace    |
| maxHops | number | no       | Optional hop limit    |

### Usage Example

```
GET http://localhost:4000/api/traceroute?target=example.com
```

### Expected Output

```json
{
  "hops": [
    {
      "hop": 1,
      "ip": "192.168.1.1",
      "latencies": [1.10, 1.00, 1.20],
      "timeout": false
    },
    {
      "hop": 2,
      "ip": "10.0.0.1",
      "latencies": [5.30, 5.40, 5.20],
      "timeout": false
    }
  ],
  "totalHops": 2
}
```

---

## TLS Inspector Endpoint

### Route

```
GET /api/tls?domain=<domain>&port=<optional>
```

### Query Parameters

| Param  | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| domain | string | yes      | Hostname without scheme       |
| port   | number | no       | Defaults to 443               |

### Usage Example

```
GET http://localhost:4000/api/tls?domain=example.com
```

### Sample Response

```json
{
  "protocol": "TLSv1.3",
  "cipher": "TLS_AES_256_GCM_SHA384",
  "certificate": {
    "subjectCommonName": "example.com",
    "issuerCommonName": "Example CA",
    "san": ["example.com", "www.example.com"],
    "validFrom": "Jan  1 00:00:00 2024 GMT",
    "validTo": "Jan  1 23:59:59 2026 GMT",
    "serialNumber": "1234567890ABCDEF",
    "fingerprint": "AA:BB:..."
  },
  "daysRemaining": 250,
  "isExpired": false,
  "isSelfSigned": false
}
```

---

## HTTP Inspector Endpoint

### Route

```
GET /api/http-info?url=<http-or-https-url>
```

### Query Parameters

| Param | Type   | Required | Description                             |
|-------|--------|----------|-----------------------------------------|
| url   | string | yes      | Must start with http:// or https://     |

### Usage Example

```
GET http://localhost:4000/api/http-info?url=https://example.com
```

### Sample Response

```json
{
  "finalUrl": "https://example.com/",
  "statusCode": 200,
  "statusText": "OK",
  "protocolVersion": "HTTP/2",
  "headers": {
    "content-type": "text/html; charset=UTF-8",
    "date": "Tue, 01 Jan 2025 12:00:00 GMT",
    "server": "ECS (nyb/1D2A)"
  }
}
```

---

## Error Responses

### Invalid URL

```json
{
  "error": "INVALID_QUERY",
  "message": "Invalid query parameters"
}
```

### Network/DNS Error

```json
{
  "error": "NETWORK_ERROR",
  "message": "Network error while performing HTTP request"
}
```

### Timeout

```json
{
  "error": "TIMEOUT",
  "message": "HTTP request timed out before receiving a response"
}
```

---

## Docker Network Endpoint

### Route

```
GET /api/docker/network
```

### Query Parameters

| Param         | Type    | Required | Description                                   |
|---------------|---------|----------|-----------------------------------------------|
| networkName   | string  | no       | Filter by specific Docker network             |
| includeStopped| boolean | no       | Reserved for future support                   |

### Usage Example

```
GET http://localhost:4000/api/docker/network
```

Filtered example:

```
GET http://localhost:4000/api/docker/network?networkName=bridge
```

### Sample Response

```json
{
  "nodes": [
    {
      "id": "net1-id",
      "name": "bridge",
      "type": "network"
    },
    {
      "id": "container-1",
      "name": "web_app",
      "type": "container",
      "image": "nginx:latest",
      "state": "running",
      "ipAddress": "172.18.0.2"
    }
  ],
  "links": [
    {
      "sourceId": "container-1",
      "targetId": "net1-id",
      "relation": "attached"
    }
  ]
}
```
