import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { useAuthStore } from '../stores/useAuthStore'

export const SignupPage = () => {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다')
      return
    }
    try {
      await signup({ email, password })
      navigate('/calendar')
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해 주세요')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Paper className="p-8 w-full max-w-md" elevation={2}>
        <Typography variant="h5" className="text-center font-bold mb-6">
          회원가입
        </Typography>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

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
            helperText="6자 이상 입력해주세요"
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>
        </form>

        <Typography variant="body2" className="text-center mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            로그인
          </Link>
        </Typography>
      </Paper>
    </div>
  )
}
