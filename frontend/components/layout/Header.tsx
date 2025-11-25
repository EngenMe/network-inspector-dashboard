import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <header className="border-b bg-background/80 backdrop-blur">
            <div className="container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo-32.png"
                        width={32}
                        height={32}
                        alt="Network Inspector logo"
                        className="rounded"
                    />
                    <span className="text-sm font-semibold tracking-tight">
            Network Inspector
          </span>
                </Link>

                <nav className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-foreground">
                        DNS
                    </Link>
                    <Link
                        href="/results"
                        className="transition-colors hover:text-foreground"
                    >
                        Results
                    </Link>
                </nav>
            </div>
        </header>
    )
}
