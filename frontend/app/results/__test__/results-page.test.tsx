import { describe, it, expect } from 'vitest'
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultsPage from '../page'

const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>(
        'next/navigation',
    )

    return {
        ...actual,
        useSearchParams: () => mockSearchParams,
    }
})

describe('Results page', () => {
    it('renders all main dashboard sections', () => {
        mockSearchParams.delete('target')
        render(<ResultsPage />)

        const titles = [
            'DNS',
            'Ping',
            'Traceroute',
            'TLS',
            'HTTP',
            'MTU / MSS',
            'Docker Network Map',
        ]

        for (const title of titles) {
            const matches = screen.getAllByText(title)
            expect(matches.length).toBeGreaterThan(0)
        }
    })

    it('displays scanned target from URL params', () => {
        mockSearchParams.set('target', 'example.com')
        render(<ResultsPage />)

        expect(screen.getByText('example.com')).toBeInTheDocument()
    })

    it('renders without errors on a mobile-sized viewport', () => {
        ;(globalThis as any).innerWidth = 375
        render(<ResultsPage />)

        const titles = [
            'DNS',
            'Ping',
            'Traceroute',
            'TLS',
            'HTTP',
            'MTU / MSS',
            'Docker Network Map',
        ]

        for (const title of titles) {
            const matches = screen.getAllByText(title)
            expect(matches.length).toBeGreaterThan(0)
        }
    })
})
