import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import type { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const email = useAuthStore((s) => s.email)
  const adminUserId = import.meta.env.VITE_ADMIN_USER_ID
  if (!adminUserId || email !== adminUserId) {
    return <Navigate to="/calendar" replace />
  }
  return <>{children}</>
}
