import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Page non trouv&eacute;e
      </h2>
      <p className="mt-2 text-gray-500 text-center max-w-md">
        La page que vous recherchez n&apos;existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;e.
      </p>
      <Link to="/home" className="mt-8 btn-primary">
        Retour &agrave; l&apos;accueil
      </Link>
    </div>
  )
}
