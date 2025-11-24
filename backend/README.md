# Network Inspector Dashboard – Backend

Backend service for the **Network Inspector Dashboard**, providing DNS lookup, Ping, Traceroute, TLS inspection, and HTTP metadata retrieval.

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

This backend was initialized using `bun init` (Bun v1.1.45).  
Bun: https://bun.sh

---

# Ping Endpoint

## Route
```
GET /api/ping?target=<domain-or-ip>&count=<optional>
```

## Query Parameters
| Param  | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| target | string | yes      | Domain or IP to ping            |
| count  | number | no       | Number of packets (default: 4)  |

## Usage Example
```
GET http://localhost:4000/api/ping?target=8.8.8.8
```

## Expected Output
```json
{
  "latencies": [23.1, 24.5, 25.0, 22.8],
  "avg": 23.85,
  "packetLoss": 0
}
```

---

# Traceroute Endpoint

## Route
```
GET /api/traceroute?target=<domain-or-ip>&maxHops=<optional>
```

## Query Parameters
| Param   | Type   | Required | Description                             |
|---------|--------|----------|-----------------------------------------|
| target  | string | yes      | Domain or IP to trace (non-empty)       |
| maxHops | number | no       | Maximum number of hops to trace         |

## Usage Example
```
GET http://localhost:4000/api/traceroute?target=example.com
```

## Expected Output
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

# TLS Inspector Endpoint

## Route
```
GET /api/tls?domain=<domain>&port=<optional>
```

## Query Parameters
| Param  | Type   | Required | Description                    |
|--------|--------|----------|--------------------------------|
| domain | string | yes      | Hostname without scheme        |
| port   | number | no       | Defaults to `443`              |

## Usage Example
```
GET http://localhost:4000/api/tls?domain=example.com
```

## Sample Response
```json
{
  "protocol": "TLSv1.3",
  "cipher": "TLS_AES_256_GCM_SHA384",
  "certificate": {
    "subjectCommonName": "example.com",
    "issuerCommonName": "Example CA",
    "san": [
      "example.com",
      "www.example.com"
    ],
    "validFrom": "Jan  1 00:00:00 2024 GMT",
    "validTo": "Jan  1 23:59:59 2026 GMT",
    "serialNumber": "1234567890ABCDEF",
    "fingerprint": "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD"
  },
  "daysRemaining": 250,
  "isExpired": false,
  "isSelfSigned": false
}
```
