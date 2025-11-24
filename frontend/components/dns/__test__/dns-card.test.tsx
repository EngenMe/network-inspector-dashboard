import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { DnsCard } from '../dns-card'
import type { DnsLookupResult } from '@/lib/types/dns'

const mockFetch = vi.fn()

const baseResult: DnsLookupResult = {
    domain: 'example.com',
    resolvedAt: new Date().toISOString(),
    records: {},
}

describe('DnsCard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        globalThis.fetch = mockFetch
    })

    afterEach(() => {
        cleanup()
    })

    it('renders loading state', () => {
        const { container } = render(<DnsCard domain="" isLoading />)
        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
    })

    it('renders empty state', () => {
        render(<DnsCard domain="" />)
        expect(screen.getByText(/Waiting for a scan/i)).toBeInTheDocument()
    })

    it('renders error state', () => {
        render(<DnsCard domain="example.com" error="Something went wrong" />)
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })

    it('renders success with records', () => {
        const result: DnsLookupResult = {
            ...baseResult,
            records: {
                a: ['1.1.1.1'],
                ns: ['ns1.example.com'],
            },
        }

        render(<DnsCard domain="example.com" result={result} />)

        // This will now match only the badge, as previous cards are cleaned
        expect(screen.getByText('example.com')).toBeInTheDocument()
        expect(screen.getByText('A')).toBeInTheDocument()
        expect(screen.getByText('NS')).toBeInTheDocument()
    })
})
