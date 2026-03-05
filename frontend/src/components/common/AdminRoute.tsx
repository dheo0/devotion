import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import type { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAdmin = useAuthStore((s) => s.isAdmin)
  if (!isAdmin) {
    return <Navigate to="/calendar" replace />
  }
  return <>{children}</>
}
