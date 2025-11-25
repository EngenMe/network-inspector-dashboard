# Network Inspector Dashboard – Backend

Backend service for the Network Inspector Dashboard, providing DNS Lookup, Ping, Traceroute, TLS Inspection, HTTP Metadata, Docker Network Mapping, and MTU/MSS detection. Built with Bun and Fastify.

## Installation
bun install  
bun run index.ts

## Ping Endpoint
GET /api/ping?target=<domain-or-ip>&count=<optional>

Params  
target (required)  
count (optional, default 4)

Example  
GET http://localhost:4000/api/ping?target=8.8.8.8

Response
```json
{
  "latencies": [23.1, 24.5, 25.0, 22.8],
  "avg": 23.85,
  "packetLoss": 0
}
```

## Traceroute Endpoint
GET /api/traceroute?target=<domain-or-ip>&maxHops=<optional>

Example  
GET http://localhost:4000/api/traceroute?target=example.com

Response
```json
{
  "hops": [
    { "hop": 1, "ip": "192.168.1.1", "latencies": [1.10, 1.00, 1.20], "timeout": false },
    { "hop": 2, "ip": "10.0.0.1", "latencies": [5.30, 5.40, 5.20], "timeout": false }
  ],
  "totalHops": 2
}
```

## TLS Inspector Endpoint
GET /api/tls?domain=<domain>&port=<optional>

Example  
GET http://localhost:4000/api/tls?domain=example.com

Response
```json
{
  "protocol": "TLSv1.3",
  "cipher": "TLS_AES_256_GCM_SHA384",
  "certificate": {
    "subjectCommonName": "example.com",
    "issuerCommonName": "Example CA",
    "san": ["example.com", "www.example.com"],
    "validFrom": "Jan 1 2024 GMT",
    "validTo": "Jan 1 2026 GMT",
    "serialNumber": "1234567890ABCDEF",
    "fingerprint": "AA:BB:..."
  },
  "daysRemaining": 250,
  "isExpired": false,
  "isSelfSigned": false
}
```

## HTTP Inspector Endpoint
GET /api/http-info?url=<http-or-https-url>

Example  
GET http://localhost:4000/api/http-info?url=https://example.com

Response
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

Errors
```json
{ "error": "INVALID_QUERY" }
```
```json
{ "error": "NETWORK_ERROR" }
```
```json
{ "error": "TIMEOUT" }
```

## Docker Network Endpoint
GET /api/docker/network

Example  
GET http://localhost:4000/api/docker/network  
GET http://localhost:4000/api/docker/network?networkName=bridge

Response
```json
{
  "nodes": [
    { "id": "net1-id", "name": "bridge", "type": "network" },
    { "id": "container-1", "name": "web_app", "type": "container", "image": "nginx:latest", "state": "running", "ipAddress": "172.18.0.2" }
  ],
  "links": [
    { "sourceId": "container-1", "targetId": "net1-id", "relation": "attached" }
  ]
}
```

## MTU/MSS Endpoint
GET /api/mtu-mss?target=<domain-or-ip>&startSize=<optional>&endSize=<optional>&step=<optional>

Example  
GET http://localhost:4000/api/mtu-mss?target=google.com&startSize=1200&endSize=1400&step=20

Response
```json
{
  "pathMtu": 1380,
  "estimatedMss": 1340,
  "successfulSizes": [1200, 1220, 1240, 1260, 1280, 1300, 1320, 1340, 1360, 1380],
  "failedSizes": [],
  "rawOutput": ["..."]
}
```