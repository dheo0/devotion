import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { useAuthStore } from '../stores/useAuthStore'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
  </svg>
)

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#3C1E1E" d="M9 0C4.029 0 0 3.134 0 7c0 2.478 1.553 4.65 3.897 5.903L2.93 16.5c-.083.308.222.554.497.385L7.5 14.09c.492.063.994.097 1.5.097 4.971 0 9-3.134 9-7S13.971 0 9 0z"/>
  </svg>
)

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loginWithProvider, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
      navigate('/calendar')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Paper className="p-8 w-full max-w-md" elevation={2}>
        <Typography variant="h4" className="text-center font-bold mb-2">
          Devotion
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-center mb-6">
          하루 성경말씀 기록
        </Typography>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <div className="flex flex-col gap-3 mb-4">
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => loginWithProvider('google')}
            startIcon={<GoogleIcon />}
            sx={{ borderColor: '#dadce0', color: '#3c4043', '&:hover': { borderColor: '#c6c6c6', backgroundColor: '#f8f9fa' } }}
          >
            Google로 계속하기
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => loginWithProvider('kakao')}
            startIcon={<KakaoIcon />}
            sx={{ backgroundColor: '#FEE500', color: '#3C1E1E', '&:hover': { backgroundColor: '#F5DC00' }, boxShadow: 'none' }}
          >
            카카오로 계속하기
          </Button>
        </div>

        <Divider className="mb-4">
          <Typography variant="caption" color="text.secondary">또는 이메일로 로그인</Typography>
        </Divider>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <Typography variant="body2" className="text-center mt-4">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            회원가입
          </Link>
        </Typography>
      </Paper>
    </div>
  )
}
