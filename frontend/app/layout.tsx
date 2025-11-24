import type { Metadata } from "next"
import "./globals.css"
import AppShell from "@/components/layout/AppShell"

export const metadata: Metadata = {
    title: "Network Inspector Dashboard",
    description: "Inspect DNS, ping, traceroute, TLS, HTTP, and Docker networks",
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16" },
            { url: "/favicon-32x32.png", sizes: "32x32" },
            { url: "/favicon.ico" }
        ],
        apple: "/apple-touch-icon.png"
    },
    manifest: "/manifest.json",
    openGraph: {
        title: "Network Inspector Dashboard",
        description: "Advanced networking inspection toolkit",
        images: ["/opengraph-image.png"]
    }
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
