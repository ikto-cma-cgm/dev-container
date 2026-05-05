import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '@/components/Card'
import Button from '@/components/Button'

interface StatCard {
  label: string
  value: string
}

async function fetchStats(): Promise<StatCard[]> {
  const res = await fetch('/api/stats')
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
    enabled: false,
  })

  const handleRefresh = () => {
    setRefreshing(true)
    // Trigger refetch logic here
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={handleRefresh} loading={refreshing}>
          Rafra&icirc;chir
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <Card>
          <p className="text-red-600 text-center">{error.message}</p>
        </Card>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card title="Aucune donn&eacute;e" description="Cliquez sur Rafra&icirc;chir pour charger les statistiques.">
          <p className="text-sm text-gray-500 text-center py-4">
            Configurez l&apos;endpoint /api/stats pour activer les donn&eacute;es du dashboard.
          </p>
        </Card>
      )}
    </div>
  )
}
