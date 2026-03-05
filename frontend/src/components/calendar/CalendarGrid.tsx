import { formatDate } from '../../utils/date'
import { CalendarCell } from './CalendarCell'
import type { Devotion } from '../../types/devotion'

interface CalendarGridProps {
  daysInMonth: Date[]
  startDayOfWeek: number
  devotions: Devotion[]
  today: string
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export const CalendarGrid = ({
  daysInMonth,
  startDayOfWeek,
  devotions,
  today,
}: CalendarGridProps) => {
  const devotionMap = new Map(devotions.map((d) => [d.date, d]))
  const currentMonth = daysInMonth[0]?.getMonth()

  const emptyCells = Array.from({ length: startDayOfWeek })

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={[
              'text-center text-xs font-semibold py-2',
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500',
            ].join(' ')}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map((date) => {
          const dateStr = formatDate(date)
          return (
            <CalendarCell
              key={dateStr}
              date={date}
              devotion={devotionMap.get(dateStr)}
              isToday={dateStr === today}
              isCurrentMonth={date.getMonth() === currentMonth}
            />
          )
        })}
      </div>
    </div>
  )
}
