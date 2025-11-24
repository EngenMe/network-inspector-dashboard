import { describe, it, expect } from 'vitest'
import { vi } from 'vitest'

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<typeof import('next/navigation')>(
        'next/navigation',
    )

    return {
        ...actual,
        useSearchParams: () => new URLSearchParams(),
    }
})

import { render, screen } from '@testing-library/react'
import ResultsPage from '../page'

describe('Results page', () => {
    it('renders all results cards', () => {
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
