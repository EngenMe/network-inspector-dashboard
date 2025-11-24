import type { Metadata } from "next"
import "./globals.css"
import AppShell from "@/components/layout/AppShell"

export const metadata: Metadata = {
    title: "Network Inspector Dashboard",
    description: "Inspect DNS, ping, traceroute, TLS, HTTP, and Docker networks",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <AppShell>{children}</AppShell>
        </body>
        </html>
    )
}
