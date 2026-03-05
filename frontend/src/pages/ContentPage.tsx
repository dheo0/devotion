import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { DevotionForm } from '../components/content/DevotionForm'
import { DevotionReadView } from '../components/content/DevotionReadView'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useDevotionStore } from '../stores/useDevotionStore'
import { formatDate } from '../utils/date'
import type { DevotionCreateRequest, DevotionUpdateRequest } from '../types/devotion'

export const ContentPage = () => {
  const { date } = useParams<{ date?: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentDevotion, isLoading, fetchByDate, create, update, remove, clearCurrent } =
    useDevotionStore()

  const isNew = !date
  const initialDate = searchParams.get('date') ?? formatDate(new Date())
  const [isEditMode, setIsEditMode] = useState(isNew)

  useEffect(() => {
    if (date) {
      fetchByDate(date)
    } else {
      clearCurrent()
    }
  }, [date, fetchByDate, clearCurrent])

  const handleSave = async (data: DevotionCreateRequest | DevotionUpdateRequest) => {
    if (isNew) {
      const created = await create(data as DevotionCreateRequest)
      navigate(`/content/${created.date}`, { replace: true })
    } else if (currentDevotion) {
      await update(currentDevotion.id, data as DevotionUpdateRequest)
      setIsEditMode(false)
    }
  }

  const handleDelete = async () => {
    if (!currentDevotion) return
    const confirmed = window.confirm('이 디보션을 삭제하시겠습니까?')
    if (!confirmed) return
    await remove(currentDevotion.id)
    navigate('/calendar')
  }

  if (isLoading && !isNew) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" className="font-bold flex-1">
          {isNew ? '새 디보션' : '디보션'}
        </Typography>

        {!isNew && currentDevotion && (
          <div className="flex gap-1">
            <ButtonGroup size="small">
              <Button
                variant={isEditMode ? 'contained' : 'outlined'}
                onClick={() => setIsEditMode(true)}
                startIcon={<EditIcon />}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
              >
                삭제
              </Button>
            </ButtonGroup>
          </div>
        )}
      </div>

      <Paper className="p-6" elevation={1}>
        {isNew || isEditMode ? (
          <DevotionForm
            key={isNew ? 'new' : currentDevotion?.id}
            initialDate={isNew ? initialDate : undefined}
            devotion={isNew ? undefined : (currentDevotion ?? undefined)}
            onSave={handleSave}
            isLoading={isLoading}
          />
        ) : currentDevotion ? (
          <DevotionReadView devotion={currentDevotion} />
        ) : (
          <Typography color="text.secondary" className="text-center py-8">
            디보션을 찾을 수 없습니다
          </Typography>
        )}
      </Paper>
    </div>
  )
}
