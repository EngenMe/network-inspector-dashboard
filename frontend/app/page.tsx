'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Page() {
    const router = useRouter()
    const [target, setTarget] = useState('')
    const [lastLookupTarget, setLastLookupTarget] = useState<string | null>(null)

    const trimmedTarget = target.trim()

    function handleRunLookup() {
        if (!trimmedTarget) return
        // DNS-only lookup integration will be added later
        setLastLookupTarget(trimmedTarget)
    }

    function handleScanAllModules() {
        if (!trimmedTarget) return
        router.push(`/results?target=${encodeURIComponent(trimmedTarget)}`)
    }

    return (
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 py-10">
            <h1 className="text-3xl font-semibold tracking-tight">
                Network Inspector
            </h1>

            <div className="space-y-2">
                <label
                    htmlFor="target"
                    className="text-sm font-medium leading-none"
                >
                    Domain or hostname
                </label>
                <Input
                    id="target"
                    placeholder="example.com or 1.1.1.1"
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleRunLookup}>
                    Run lookup
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleScanAllModules}
                >
                    Scan all modules
                </Button>
            </div>

            {lastLookupTarget && (
                <p className="text-xs text-muted-foreground">
                    Lookup started for{' '}
                    <span className="font-mono">{lastLookupTarget}</span> ·
                    DNS module integration coming in the next steps.
                </p>
            )}
        </div>
    )
}
