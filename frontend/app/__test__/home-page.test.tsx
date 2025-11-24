import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Page from '../page'

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
    }),
}))

describe('Home DNS page', () => {
    it('renders domain input', () => {
        render(<Page />)

        const input = screen.getByLabelText(/domain or hostname/i)
        expect(input).toBeInTheDocument()
    })

    it('renders run lookup and scan all modules buttons', () => {
        render(<Page />)

        const runButtons = screen.getAllByRole('button', { name: /run lookup/i })
        expect(runButtons.length).toBeGreaterThan(0)

        const scanAllButtons = screen.getAllByRole('button', {
            name: /scan all modules/i,
        })
        expect(scanAllButtons.length).toBeGreaterThan(0)
    })
})
