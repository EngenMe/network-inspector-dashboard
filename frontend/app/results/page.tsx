import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ResultsPage() {
    const cards = [
        { title: "DNS", desc: "DNS summary card will appear here once results are shared from the DNS module." },
        { title: "Ping", desc: "Ping latency and packet loss graphs will be added here." },
        { title: "Traceroute", desc: "Hop-by-hop route visualization will be rendered in this card." },
        { title: "TLS", desc: "Certificate chain and cipher details will be shown here." },
        { title: "HTTP", desc: "HTTP status, headers, and protocol information will be displayed here." },
        { title: "MTU / MSS", desc: "MTU and MSS behaviors will be summarized here after implementation." },
        { title: "Docker Network Map", desc: "Docker container networks and bridges will be visualized here.", full: true }
    ]

    return (
        <main className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-6 px-4 py-10">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Scan Results</h1>
                <p className="text-sm text-muted-foreground">
                    Global results dashboard placeholder for upcoming network modules.
                </p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card, i) => (
                    <Card
                        key={i}
                        className={card.full ? "md:col-span-2 xl:col-span-3" : ""}
                    >
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>{card.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                No data yet – module not wired.
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    )
}
