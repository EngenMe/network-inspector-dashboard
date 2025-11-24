# network-inspector-dashboard-backend

To install dependencies:

bun install

To run:

bun run index.ts

This project was created using bun init in bun v1.1.45.
Bun (https://bun.sh) is a fast all-in-one JavaScript runtime.

---

# Ping Endpoint

## Route
GET /api/ping?target=<domain-or-ip>&count=<optional>

## Query Parameters
Param    Type    Required    Description
target   string  yes         Domain or IP to ping
count    number  no          Number of packets (default: 4)

## Usage Example
GET http://localhost:4000/api/ping?target=8.8.8.8

## Expected Output
{
"latencies": [23.1, 24.5, 25.0, 22.8],
"avg": 23.85,
"packetLoss": 0
}

---

# Traceroute Endpoint

## Route
GET /api/traceroute?target=<domain-or-ip>&maxHops=<optional>

## Query Parameters
Param     Type    Required    Description
target    string  yes         Domain or IP to trace (must be non-empty)
maxHops   number  no          Maximum number of hops to trace

## Usage Example
GET http://localhost:4000/api/traceroute?target=example.com

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
