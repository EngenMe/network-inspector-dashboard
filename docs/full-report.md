# **Network Inspector Dashboard – Full Project Plan**

A complete, recruiter-friendly system that showcases backend depth, networking expertise, Docker skills, and full-stack development.

---

## **1. Project Overview**

A dashboard where users enter any domain/IP and instantly see:

- DNS records  
- Ping latency  
- Traceroute results  
- TLS/HTTPS certificate details  
- HTTP headers and protocol  
- MTU/MSS behavior  
- NAT detection  
- Docker container network visualization  

---

## **2. Main Features**

### **Core Networking Tools**
- DNS Lookup (A, AAAA, MX, CNAME, NS, SOA)  
- Ping with latency & packet loss  
- Traceroute hop visualization  
- TLS inspector (cert chain, cipher suite, protocol)  
- HTTP inspector (headers, status, protocol)  
- MTU/MSS test  
- Port scanner for common ports  

### **Advanced Features**
- Docker network map  
- Packet capture via tcpdump (local mode)  
- Reverse proxy detection (Nginx, Cloudflare, HAProxy)  
- SNI & ALPN viewer  

---

## **3. System Architecture**

```
┌────────────────────────┐
│        Next.js UI       │
└──────────▲──────────────┘
           │ REST API
┌──────────┴──────────────────────────────┐
│            Node.js Backend              │
│  DNS • Ping • Traceroute • TLS • HTTP   │
│  Docker mapping • Packet capture         │
├──────────────────────────────────────────┤
│ Docker Tools Container (tcpdump, ip)     │
└──────────────────────────────────────────┘
```

---

## **4. Tech Stack**

### **Frontend**
- Next.js 14  
- TailwindCSS  
- shadcn/ui  
- React charts  

### **Backend**
- Node.js  
- Fastify  
- Child_process execution  
- Docker SDK  

### **DevOps**
- Docker  
- Docker Compose  
- Nginx  
- GitHub Actions  

---

## **5. API Endpoints**

```
GET /api/dns?domain=
GET /api/ping?target=
GET /api/traceroute?target=
GET /api/tls?domain=
GET /api/http-info?url=
GET /api/docker/network
```

---

## **6. Pages**

### **Home Page**
- Input field  
- Quick scan  

### **Results Dashboard**
- DNS card  
- Ping graph  
- Traceroute map  
- TLS certificate card  
- HTTP metadata  
- MTU/MSS card  
- Docker network visualization  

---

## **7. UI Wireframe**

```
+---------------------------------------------------------+
| Domain/IP: [ example.com ]  [ Scan ]                    |
+---------------------------------------------------------+

[ DNS ]   [ Ping ]   [ Traceroute ]   [ TLS ]   [ HTTP ]
---------------------------------------------------------

[ Docker Network Map ]
(Container A) -- bridge0 -- (Container B)
```

---

## **8. Folder Structure**

```
/network-inspector
  /frontend
    /app
    /components
    /lib
  /backend
    /src
      /modules
        dns/
        ping/
        traceroute/
        tls/
        http/
        docker/
      /routes
      /utils
  /docker
    /network-tools
    /backend
    /frontend
```

---

## **9. 30-Day Build Roadmap**

### **Week 1**
- Setup project  
- DNS lookup  
- Ping  
- Basic UI  

### **Week 2**
- Traceroute  
- TLS inspector  
- HTTP inspector  
- Dashboard layout  

### **Week 3**
- Docker network integration  
- Build visual map UI  

### **Week 4**
- MTU/MSS tests  
- Polish UI  
- Deployment  
- Demo video recording  

---

## **10. Demo Script**

1. Enter a domain (google.com)  
2. Show DNS, Ping, Traceroute, TLS, HTTP info updating live  
3. Switch to “Local Mode”  
4. Show Docker containers + bridges  
5. Demonstrate packet capture live  
6. Show repository + documentation  

A unique, visually appealing, deeply technical project that perfectly matches your CV.
