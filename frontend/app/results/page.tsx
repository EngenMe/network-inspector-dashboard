export default function ResultsPage() {
    return (
        <main className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-6 px-4 py-10">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Scan Results</h1>
                <p className="text-sm text-muted-foreground">
                    Global results dashboard placeholder. Other network tools (Ping, Traceroute,
                    TLS, HTTP, MTU, Docker) will be wired here later.
                </p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm">
                    <h2 className="font-medium">DNS</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        DNS summary card will appear here once data is shared from the DNS module.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm">
                    <h2 className="font-medium">Ping</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Ping latency and packet loss graphs will be added here.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm">
                    <h2 className="font-medium">Traceroute</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Hop-by-hop route visualization will be rendered in this card.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm">
                    <h2 className="font-medium">TLS</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Certificate chain and cipher details will be shown here.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm">
                    <h2 className="font-medium">HTTP</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        HTTP status, headers, and protocol information will be displayed here.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm">
                    <h2 className="font-medium">MTU / MSS</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        MTU and MSS behaviors will be summarized here after implementation.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-card-foreground shadow-sm md:col-span-2 xl:col-span-3">
                    <h2 className="font-medium">Docker Network Map</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Docker container networks and bridges will be visualized here.
                    </p>
                </div>
            </section>
        </main>
    )
}
