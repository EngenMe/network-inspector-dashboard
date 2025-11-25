export default function Footer() {
    return (
        <footer className="border-t bg-background/80">
            <div className="mx-auto w-full max-w-4xl px-4 py-4 text-xs text-muted-foreground">
                <p className="text-center">
                    © {new Date().getFullYear()} Network Inspector Dashboard
                </p>
            </div>
        </footer>
    )
}
