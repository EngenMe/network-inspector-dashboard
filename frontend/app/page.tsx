'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Page() {
    const router = useRouter()

    const [target, setTarget] = useState('')
    const [error, setError] = useState('')
    const [isScanning, setIsScanning] = useState(false)

    const trimmedTarget = target.trim()
    const hasValue = trimmedTarget.length > 0
    const showError = error.length > 0

    function handleRunLookup() {
        if (!hasValue) {
            setError('Please enter a domain or IP address.')
            return
        }

        setError('')
        setIsScanning(true)
        router.push(`/dns?domain=${encodeURIComponent(trimmedTarget)}`)
    }

    function handleScanAllModules() {
        if (!hasValue) {
            setError('Please enter a domain or IP address.')
            return
        }

        setError('')
        setIsScanning(true)
        router.push(`/results?target=${encodeURIComponent(trimmedTarget)}`)
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="flex w-full flex-col items-center space-y-8 text-center">
                <div className="max-w-2xl space-y-3">
                    <h1 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-md sm:text-5xl">
                        Network Inspector Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Real-time DNS, latency, TLS, traceroute, HTTP metadata and Docker
                        network diagnostics — powered by Fastify, Next.js, and containerized
                        tools.
                    </p>
                </div>

                <Card className="w-full max-w-xl space-y-6 border-border/70 bg-card/70 py-6 text-card-foreground shadow-sm backdrop-blur">
                    <CardHeader className="space-y-1 px-6">
                        <h2 className="text-lg font-semibold">Scan a Domain or IP</h2>
                        <p className="text-xs text-muted-foreground">
                            The backend will run DNS lookup, traceroute, MTU test, TLS
                            inspector, and more.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3 px-6">
                        <div className="space-y-2 text-left">
                            <label
                                htmlFor="target"
                                className="text-xs font-medium leading-none"
                            >
                                Domain or hostname
                            </label>
                            <Input
                                id="target"
                                aria-label="Domain or hostname"
                                aria-invalid={showError}
                                placeholder="example.com"
                                value={target}
                                autoComplete="off"
                                inputMode="url"
                                onChange={e => {
                                    setTarget(e.target.value)
                                    if (error) setError('')
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleRunLookup()
                                    }
                                }}
                                className="h-11"
                            />
                            {showError && (
                                <p
                                    role="alert"
                                    className="text-xs font-medium text-destructive"
                                >
                                    {error}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Supports DNS, IPv4, IPv6, internal networks, containers, and
                                local diagnostics.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px] font-mono text-muted-foreground sm:text-xs">
                            <span className="rounded bg-muted/60 px-2 py-1">DNS</span>
                            <span className="rounded bg-muted/60 px-2 py-1">PING</span>
                            <span className="rounded bg-muted/60 px-2 py-1">TRACEROUTE</span>
                            <span className="rounded bg-muted/60 px-2 py-1">TLS</span>
                            <span className="rounded bg-muted/60 px-2 py-1">HTTP</span>
                            <span className="rounded bg-muted/60 px-2 py-1">DOCKER</span>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col items-center gap-3 px-6">
                        <div className="flex flex-wrap justify-center gap-2">
                            <Button
                                type="button"
                                onClick={handleRunLookup}
                                disabled={!hasValue || isScanning}
                                aria-disabled={!hasValue || isScanning}
                            >
                                {/* 👇 this text must match /run lookup/i */}
                                Run lookup
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleScanAllModules}
                                disabled={!hasValue || isScanning}
                                aria-disabled={!hasValue || isScanning}
                            >
                                {/* 👇 this text must match /scan all modules/i */}
                                {isScanning ? 'Scanning…' : 'Scan all modules'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <p className="font-mono text-xs text-muted-foreground">
                    Built with Fastify • Next.js 14 • Docker • tcpdump • Networking Tools
                </p>
            </div>
        </main>
    )
}
