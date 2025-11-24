# network-inspector-dashboard-backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.45.  
[Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

---

# Ping Endpoint

## Route
```
GET /api/ping?target=<domain-or-ip>&count=<optional>
```

## Query Parameters
| Param  | Type   | Required | Description |
|--------|--------|----------|-------------|
| target | string | yes      | Domain or IP to ping |
| count  | number | no       | Number of packets (default: 4) |

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