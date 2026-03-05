import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/date'
import type { Devotion } from '../../types/devotion'

interface CalendarCellProps {
  date: Date
  devotion?: Devotion
  isToday: boolean
  isCurrentMonth: boolean
}

const hasUserContent = (d: Devotion) =>
  !!(d.summary || d.givenWord || d.aboutGod || d.aboutMe || d.actionItems)

export const CalendarCell = ({ date, devotion, isToday, isCurrentMonth }: CalendarCellProps) => {
  const navigate = useNavigate()
  const dateStr = formatDate(date)

  const handleClick = () => {
    if (devotion) {
      navigate(`/content/${dateStr}`)
    } else {
      navigate(`/content/new?date=${dateStr}`)
    }
  }

  const dotColor = devotion
    ? hasUserContent(devotion)
      ? 'bg-sky-400'
      : 'bg-gray-400'
    : null

  return (
    <button
      onClick={handleClick}
      className={[
        'relative p-1 min-h-[60px] rounded-lg border text-left w-full transition-colors',
        isCurrentMonth ? 'bg-white hover:bg-indigo-50' : 'bg-gray-50 text-gray-400',
        isToday ? 'border-indigo-500 border-2' : 'border-gray-200',
      ].join(' ')}
    >
      <span
        className={[
          'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
          isToday ? 'bg-indigo-600 text-white' : '',
        ].join(' ')}
      >
        {date.getDate()}
      </span>
      {dotColor && (
        <div className="mt-1">
          <div className={`w-2 h-2 ${dotColor} rounded-full mx-auto`} />
        </div>
      )}
    </button>
  )
}
