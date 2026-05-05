import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
