import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue dans l&apos;application
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Cette application a &eacute;t&eacute; cr&eacute;&eacute;e avec le template React CMA CGM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Dashboard" description="Consultez vos statistiques et analyses">
          <div className="flex justify-end">
            <Link to="/dashboard">
              <Button>Acc&eacute;der</Button>
            </Link>
          </div>
        </Card>

        <Card title="Documentation" description="Guides et r&eacute;f&eacute;rences de d&eacute;veloppement">
          <p className="text-sm text-gray-500">
            Consultez la documentation dans l&apos;onglet TechDocs du Catalog Backstage.
          </p>
        </Card>

        <Card title="API" description="Points d&apos;acc&egrave;s pour les services">
          <p className="text-sm text-gray-500">
            Configurez les endpoints API dans le fichier .env.
          </p>
        </Card>
      </div>
    </div>
  )
}
