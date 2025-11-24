import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">

                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo-32.png"
                        width={32}
                        height={32}
                        alt="Network Inspector Logo"
                        className="rounded"
                    />
                    <span className="text-sm font-semibold tracking-tight">
            Network Inspector
          </span>
                </Link>

                <nav className="flex items-center gap-4 text-xs text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">DNS</Link>
                    <Link href="/results" className="hover:text-foreground">Results</Link>
                </nav>
            </div>
        </header>
    );
}
