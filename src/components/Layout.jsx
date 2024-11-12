import { Outlet } from 'react-router-dom'
import { Container, Box } from '@mui/material'

function Layout() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Outlet />
      </Box>
    </Container>
  )
}

export default Layout
