import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { formatDisplayDate } from '../../utils/date'
import type { Devotion } from '../../types/devotion'

interface DevotionReadViewProps {
  devotion: Devotion
}

interface SectionProps {
  title: string
  content: string | null
}

const Section = ({ title, content }: SectionProps) => {
  if (!content) return null
  return (
    <div className="mb-4">
      <Typography variant="subtitle2" color="primary" className="font-semibold mb-1">
        {title}
      </Typography>
      <Typography variant="body1" className="whitespace-pre-wrap">
        {content}
      </Typography>
    </div>
  )
}

const parseActionItems = (raw: string | null): string[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as string[]
  } catch {
    return raw.split('\n').filter(Boolean)
  }
  return []
}

const ActionItemsSection = ({ content }: { content: string | null }) => {
  const items = parseActionItems(content)
  if (items.length === 0) return null
  return (
    <div className="mb-4">
      <Typography variant="subtitle2" color="primary" className="font-semibold mb-1">
        실천 사항
      </Typography>
      <List dense disablePadding>
        {items.map((item, index) => (
          <ListItem key={index} disableGutters>
            <ListItemText primary={`${index + 1}. ${item}`} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export const DevotionReadView = ({ devotion }: DevotionReadViewProps) => (
  <div className="flex flex-col gap-3">
    <Typography variant="h6" className="font-bold">
      {formatDisplayDate(devotion.date)}
    </Typography>

    {devotion.title && (
      <Typography variant="h5" className="font-semibold">
        {devotion.title}
      </Typography>
    )}

    {devotion.bibleVerse && (
      <>
        <Typography variant="body1" color="primary" className="font-medium italic">
          {devotion.bibleVerse}
        </Typography>
        <Divider />
      </>
    )}

    <Section title="요약" content={devotion.summary} />
    <Section title="내게 주신 말씀" content={devotion.givenWord} />
    <Section title="하나님은 어떤 분인가" content={devotion.aboutGod} />
    <Section title="나는 어떤 사람인가" content={devotion.aboutMe} />
    <ActionItemsSection content={devotion.actionItems} />
  </div>
)
