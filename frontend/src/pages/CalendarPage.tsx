import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { CalendarGrid } from '../components/calendar/CalendarGrid'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useDevotionStore } from '../stores/useDevotionStore'
import {
  formatDate,
  formatYearMonth,
  formatDisplayMonth,
  getDaysInMonth,
  getStartDayOfWeek,
} from '../utils/date'
import { addMonths, subMonths } from 'date-fns'

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { devotions, isLoading, fetchByMonth } = useDevotionStore()
  const today = formatDate(new Date())

  useEffect(() => {
    fetchByMonth(formatYearMonth(currentDate))
  }, [currentDate, fetchByMonth])

  const handlePrev = () => setCurrentDate((d) => subMonths(d, 1))
  const handleNext = () => setCurrentDate((d) => addMonths(d, 1))

  const daysInMonth = getDaysInMonth(currentDate)
  const startDay = getStartDayOfWeek(currentDate)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <IconButton onClick={handlePrev}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          {formatDisplayMonth(currentDate)}
        </Typography>
        <IconButton onClick={handleNext}>
          <ChevronRightIcon />
        </IconButton>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CalendarGrid
          daysInMonth={daysInMonth}
          startDayOfWeek={startDay}
          devotions={devotions}
          today={today}
        />
      )}
    </div>
  )
}
