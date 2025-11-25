export default function Footer() {
    return (
        <footer className="border-t bg-background/80" role="contentinfo">
            <div className="mx-auto w-full max-w-4xl px-4 py-4 text-xs text-muted-foreground">
                <p className="text-center">
                    © {new Date().getFullYear()} Network Inspector Dashboard —{' '}
                    <a
                        href="https://faroukhasnaoui.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                    >
                        faroukhasnaoui.tech
                    </a>{' '}
                    — Farouk Hasnaoui EngenMe. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
