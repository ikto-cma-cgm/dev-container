import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from '@/pages/HomePage'

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/home']}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HomePage', () => {
  it('renders welcome heading', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/bienvenue/i)).toBeInTheDocument()
  })

  it('renders dashboard card', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
