interface CardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {(title || description) && (
        <div className="px-6 py-5 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
