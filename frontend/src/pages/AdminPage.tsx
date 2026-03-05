import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { apiClient } from '../utils/api'
import type { ApiResponse } from '../types/devotion'

interface AdminUser {
  id: string
  email: string
  createdAt: string
}

interface BulkDevotionResult {
  created: number
  skipped: number
  skippedUserIds: string[]
}

export const AdminPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [date, setDate] = useState('')
  const [bibleVerse, setBibleVerse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [result, setResult] = useState<BulkDevotionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get<ApiResponse<AdminUser[]>>('/api/v1/admin/users')
      .then(({ data }) => setUsers(data.data))
      .catch(() => setError('유저 목록을 불러오지 못했습니다'))
      .finally(() => setIsFetching(false))
  }, [])

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.size === users.length ? new Set() : new Set(users.map((u) => u.id)),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIds.size === 0) return
    setIsLoading(true)
    setResult(null)
    setError(null)
    try {
      const { data } = await apiClient.post<ApiResponse<BulkDevotionResult>>(
        '/api/v1/admin/devotions',
        { date, bibleVerse, userIds: Array.from(selectedIds) },
      )
      setResult(data.data)
      setSelectedIds(new Set())
      setDate('')
      setBibleVerse('')
    } catch {
      setError('일괄 생성 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) return <LoadingSpinner />

  return (
    <div className="max-w-2xl mx-auto">
      <Typography variant="h5" className="font-bold mb-6">
        관리자 — 디보션 일괄 생성
      </Typography>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {result && (
        <Alert severity="success" className="mb-4">
          {result.created}명 생성 완료
          {result.skipped > 0 && ` / ${result.skipped}명 건너뜀 (이미 존재)`}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Paper elevation={1} className="p-4">
          <Typography variant="subtitle1" className="font-semibold mb-3">
            날짜 / 성경 구절
          </Typography>
          <div className="flex flex-col gap-3">
            <TextField
              label="날짜"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="성경 구절"
              value={bibleVerse}
              onChange={(e) => setBibleVerse(e.target.value)}
              placeholder="예: 요한복음 3:16"
              fullWidth
            />
          </div>
        </Paper>

        <Paper elevation={1}>
          <div className="flex items-center justify-between px-4 py-2">
            <Typography variant="subtitle1" className="font-semibold">
              유저 선택
            </Typography>
            <Button size="small" onClick={toggleAll}>
              {selectedIds.size === users.length ? '전체 해제' : '전체 선택'}
            </Button>
          </div>
          <Divider />
          <List disablePadding dense>
            {users.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton onClick={() => toggleUser(user.id)}>
                  <Checkbox
                    edge="start"
                    checked={selectedIds.has(user.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={user.email}
                    secondary={user.id}
                    secondaryTypographyProps={{ className: 'text-xs' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading || selectedIds.size === 0 || !date}
          fullWidth
        >
          {isLoading ? '생성 중...' : `${selectedIds.size}명에게 디보션 생성`}
        </Button>
      </form>
    </div>
  )
}
