import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuthStore } from '../stores/useAuthStore'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('accessToken', session.access_token)
        if (session.refresh_token) {
          localStorage.setItem('refreshToken', session.refresh_token)
        }
        localStorage.setItem('userId', session.user.id)
        localStorage.setItem('email', session.user.email ?? '')
        initAuth()
      }
      navigate('/calendar', { replace: true })
    })
  }, [navigate, initAuth])

  return <LoadingSpinner />
}
