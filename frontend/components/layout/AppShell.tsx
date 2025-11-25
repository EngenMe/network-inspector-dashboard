import React from "react"
import Header from "./Header"
import Footer from "./Footer"

type AppShellProps = {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
