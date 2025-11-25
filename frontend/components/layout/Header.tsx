import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
    return (
        <header className="border-b bg-background/80 backdrop-blur">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-1.5 focus:text-xs focus:text-primary-foreground"
            >
                Skip to main content
            </a>
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    aria-label="Go to Network Inspector home"
                >
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

                <nav
                    className="flex items-center gap-4 text-xs text-muted-foreground sm:text-sm"
                    aria-label="Primary"
                >
                    <Link href="/" className="hover:text-foreground">
                        DNS
                    </Link>
                    <Link href="/results" className="hover:text-foreground">
                        Results
                    </Link>
                </nav>
            </div>
        </header>
    )
}
