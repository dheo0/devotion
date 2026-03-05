import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'

export const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const formatYearMonth = (date: Date): string => format(date, 'yyyy-MM')

export const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return format(date, 'yyyy년 M월 d일 (EEE)', { locale: ko })
}

export const formatDisplayMonth = (date: Date): string =>
  format(date, 'yyyy년 M월', { locale: ko })

export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return eachDayOfInterval({ start, end })
}

export const getStartDayOfWeek = (date: Date): number => {
  return getDay(startOfMonth(date))
}

export const toDate = (dateStr: string): Date => new Date(dateStr + 'T00:00:00')
