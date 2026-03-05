import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LogoutIcon from '@mui/icons-material/Logout'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ListIcon from '@mui/icons-material/List'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useDevotionStore } from '../../stores/useDevotionStore'

export const NavigationBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((s) => s.logout)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const clearCurrent = useDevotionStore((s) => s.clearCurrent)

  const tabValue = location.pathname.startsWith('/list') ? 1 : 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar className="gap-2">
        <Typography variant="h6" component="div" className="font-bold mr-4">
          Devotion
        </Typography>

        <Tabs
          value={tabValue}
          textColor="inherit"
          indicatorColor="secondary"
          className="flex-1"
        >
          <Tab
            icon={<CalendarMonthIcon />}
            iconPosition="start"
            label="캘린더"
            onClick={() => navigate('/calendar')}
          />
          <Tab
            icon={<ListIcon />}
            iconPosition="start"
            label="목록"
            onClick={() => navigate('/list')}
          />
        </Tabs>

        {isAdmin && (
          <Button color="inherit" onClick={() => navigate('/admin')}>
            관리자
          </Button>
        )}
        <Button color="inherit" onClick={() => { clearCurrent(); navigate('/content/new') }}>
          새 디보션
        </Button>
        <IconButton color="inherit" onClick={handleLogout} title="로그아웃">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
