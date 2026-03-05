import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/useAuthStore'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { CalendarPage } from './pages/CalendarPage'
import { ListPage } from './pages/ListPage'
import { ContentPage } from './pages/ContentPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { AdminPage } from './pages/AdminPage'
import { AdminRoute } from './components/common/AdminRoute'

export const App = () => {
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/calendar" replace />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="list" element={<ListPage />} />
          <Route path="content/new" element={<ContentPage />} />
          <Route path="content/:date" element={<ContentPage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
