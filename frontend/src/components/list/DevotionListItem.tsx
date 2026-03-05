import { useNavigate } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { formatDisplayDate } from '../../utils/date'
import type { Devotion } from '../../types/devotion'

interface DevotionListItemProps {
  devotion: Devotion
}

export const DevotionListItem = ({ devotion }: DevotionListItemProps) => {
  const navigate = useNavigate()

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => navigate(`/content/${devotion.date}`)}>
          <ListItemText
            primary={
              <Typography variant="subtitle1" className="font-semibold">
                {formatDisplayDate(devotion.date)}
              </Typography>
            }
            secondary={
              <span className="flex flex-col gap-1 mt-1">
                {devotion.bibleVerse && (
                  <Typography variant="body2" color="primary" component="span">
                    {devotion.bibleVerse}
                  </Typography>
                )}
                {devotion.summary && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                    className="line-clamp-2"
                  >
                    {devotion.summary}
                  </Typography>
                )}
              </span>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider component="li" />
    </>
  )
}
