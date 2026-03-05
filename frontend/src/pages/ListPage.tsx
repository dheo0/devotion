import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { DevotionListItem } from '../components/list/DevotionListItem'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useDevotionStore } from '../stores/useDevotionStore'
import { formatYearMonth, formatDisplayMonth } from '../utils/date'
import { addMonths, subMonths } from 'date-fns'

export const ListPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { devotions, isLoading, fetchByMonth } = useDevotionStore()

  useEffect(() => {
    fetchByMonth(formatYearMonth(currentDate))
  }, [currentDate, fetchByMonth])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <IconButton onClick={() => setCurrentDate((d) => subMonths(d, 1))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          {formatDisplayMonth(currentDate)}
        </Typography>
        <IconButton onClick={() => setCurrentDate((d) => addMonths(d, 1))}>
          <ChevronRightIcon />
        </IconButton>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : devotions.length === 0 ? (
        <Typography color="text.secondary" className="text-center py-12">
          이번 달 디보션 기록이 없습니다
        </Typography>
      ) : (
        <Paper elevation={1}>
          <List disablePadding>
            {devotions.map((d) => (
              <DevotionListItem key={d.id} devotion={d} />
            ))}
          </List>
        </Paper>
      )}
    </div>
  )
}
