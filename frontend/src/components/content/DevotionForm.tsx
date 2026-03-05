import { useState, useCallback } from 'react'
import { isAxiosError } from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Devotion, DevotionCreateRequest, DevotionUpdateRequest } from '../../types/devotion'

interface DevotionFormProps {
  initialDate?: string
  devotion?: Devotion
  onSave: (data: DevotionCreateRequest | DevotionUpdateRequest) => Promise<void>
  isLoading: boolean
}

const parseActionItems = (raw: string | null | undefined): string[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as string[]
  } catch {
    // 기존 plain text 데이터 호환
    return raw.split('\n').filter(Boolean)
  }
  return []
}

export const DevotionForm = ({ initialDate, devotion, onSave, isLoading }: DevotionFormProps) => {
  const [date, setDate] = useState(devotion?.date ?? initialDate ?? '')
  const [title, setTitle] = useState(devotion?.title ?? '')
  const [bibleVerse] = useState(devotion?.bibleVerse ?? '')
  const [summary, setSummary] = useState(devotion?.summary ?? '')
  const [givenWord, setGivenWord] = useState(devotion?.givenWord ?? '')
  const [aboutGod, setAboutGod] = useState(devotion?.aboutGod ?? '')
  const [aboutMe, setAboutMe] = useState(devotion?.aboutMe ?? '')
  const [actionItems, setActionItems] = useState<string[]>(() => parseActionItems(devotion?.actionItems))
  const [actionInput, setActionInput] = useState('')
  const [duplicateError, setDuplicateError] = useState(false)

  const addActionItem = () => {
    const trimmed = actionInput.trim()
    if (!trimmed) return
    setActionItems((prev) => [...prev, trimmed])
    setActionInput('')
  }

  const removeActionItem = (index: number) => {
    setActionItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleActionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addActionItem()
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave({
        date,
        title: title || undefined,
        bibleVerse: bibleVerse || undefined,
        summary: summary || undefined,
        givenWord: givenWord || undefined,
        aboutGod: aboutGod || undefined,
        aboutMe: aboutMe || undefined,
        actionItems: actionItems.length > 0 ? JSON.stringify(actionItems) : undefined,
      })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setDuplicateError(true)
        setDate('')
      } else {
        throw err
      }
    }
  }, [date, title, bibleVerse, summary, givenWord, aboutGod, aboutMe, actionItems, onSave])

  return (
    <>
    <Snackbar
      open={duplicateError}
      autoHideDuration={4000}
      onClose={() => setDuplicateError(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={() => setDuplicateError(false)} variant="filled">
        해당 날짜에 이미 디보션이 존재합니다. 날짜를 다시 선택해 주세요.
      </Alert>
    </Snackbar>
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="날짜"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="오늘 말씀의 제목"
          fullWidth
        />
        <TextField
          label="성경 구절"
          value={bibleVerse}
          placeholder="예: 요한복음 3:16"
          fullWidth
          slotProps={{ input: { readOnly: true } }}
          helperText="성경 구절은 관리자가 설정합니다"
        />
        <TextField
          label="요약"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="내게 주신 말씀"
          value={givenWord}
          onChange={(e) => setGivenWord(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="하나님은 어떤 분인가"
          value={aboutGod}
          onChange={(e) => setAboutGod(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="나는 어떤 사람인가"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <div>
          <Typography variant="subtitle2" color="text.secondary" className="mb-1">
            실천 사항
          </Typography>
          <div className="flex gap-2 mb-2">
            <TextField
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              onKeyDown={handleActionKeyDown}
              placeholder="실천 항목 입력 후 Enter 또는 추가"
              size="small"
              fullWidth
            />
            <IconButton onClick={addActionItem} color="primary" disabled={!actionInput.trim()}>
              <AddIcon />
            </IconButton>
          </div>
          {actionItems.length > 0 && (
            <List dense disablePadding>
              {actionItems.map((item, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={() => removeActionItem(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${index + 1}. ${item}`} />
                </ListItem>
              ))}
            </List>
          )}
        </div>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading || !date}
        >
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </Stack>
    </form>
    </>
  )
}
