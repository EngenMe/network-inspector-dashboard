export default function Footer() {
    return (
        <footer className="border-t bg-background/80">
            <div className="container flex flex-col items-center gap-2 py-4 text-[11px] text-muted-foreground sm:flex-row sm:justify-between sm:text-xs">
                <p className="text-center sm:text-left">
                    Network Inspector Dashboard · Basic UI scaffold · Backend integration
                    coming next.
                </p>
                <p className="text-center sm:text-right">
                    © {new Date().getFullYear()} Network Inspector
                </p>
            </div>
        </footer>
    )
}
