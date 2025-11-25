import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <header className="border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

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

                <nav className="flex items-center gap-4 text-xs text-muted-foreground sm:text-sm">
                    <Link href="/" className="hover:text-foreground">DNS</Link>
                    <Link href="/results" className="hover:text-foreground">Results</Link>
                </nav>
            </div>
        </header>
    )
}
