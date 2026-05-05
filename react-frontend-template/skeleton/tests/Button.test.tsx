import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('disables on disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables on loading prop', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
