import { render, screen } from '@testing-library/react'
import Card from '@/components/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Card title="My Title">Content</Card>)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Card title="Title" description="A description">Content</Card>)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
