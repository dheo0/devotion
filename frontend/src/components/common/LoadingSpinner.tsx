import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export const LoadingSpinner = () => (
  <Box className="flex items-center justify-center h-full min-h-[200px]">
    <CircularProgress />
  </Box>
)
