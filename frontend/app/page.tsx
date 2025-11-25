'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
    const router = useRouter()

    const [target, setTarget] = useState('')
    const [lastLookupTarget, setLastLookupTarget] = useState('')
    const [error, setError] = useState('')
    const [isScanning, setIsScanning] = useState(false)

    const trimmedTarget = target.trim()
    const hasValue = trimmedTarget.length > 0
    const showError = error.length > 0
    const hasLastLookup = lastLookupTarget.length > 0

    function handleRunLookup() {
        if (!hasValue) {
            setError('Please enter a domain or IP address.')
            return
        }

        setError('')
        setLastLookupTarget(trimmedTarget)
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
        <section className="flex min-h-[70vh] items-center justify-center px-4">
            <Card className="w-full max-w-xl border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                        Network Inspector
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Run a quick scan on any domain or IP to inspect DNS, latency and more.
                    </p>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        <label htmlFor="target" className="text-sm font-medium leading-none">
                            Domain or hostname
                        </label>
                        <Input
                            id="target"
                            placeholder="example.com or 1.1.1.1"
                            value={target}
                            onChange={e => {
                                setTarget(e.target.value)
                                if (error) setError('')
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter a public domain or IP address to start the inspection.
                        </p>
                    </div>

                    {showError ? (
                        <p className="text-xs font-medium text-destructive">{error}</p>
                    ) : undefined}
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            onClick={handleRunLookup}
                            disabled={!hasValue || isScanning}
                        >
                            Run lookup
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleScanAllModules}
                            disabled={!hasValue || isScanning}
                        >
                            {isScanning ? 'Scanning…' : 'Scan all modules'}
                        </Button>
                    </div>

                    {hasLastLookup ? (
                        <p className="text-xs text-muted-foreground">
                            Lookup started for <span className="font-mono">{lastLookupTarget}</span> ·
                            DNS module integration coming in next steps.
                        </p>
                    ) : undefined}
                </CardFooter>
            </Card>
        </section>
    )
}
