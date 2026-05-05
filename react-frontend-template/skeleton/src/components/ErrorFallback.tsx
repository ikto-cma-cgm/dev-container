interface ErrorBoundary {
  error: Error | null
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundary) {
  if (!error) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">{error.message}</p>
        <button onClick={reset} className="btn-primary">
          R&eacute;essayer
        </button>
      </div>
    </div>
  )
}
