import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppShell from '../AppShell'

describe('AppShell', () => {
    it('renders header, footer, and children', () => {
        render(
            <AppShell>
                <div data-testid="content">Content</div>
            </AppShell>,
        )

        expect(
            screen.getByRole('link', { name: /network inspector/i }),
        ).toBeInTheDocument()

        expect(screen.getByTestId('content')).toBeInTheDocument()
    })
})
