import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Stack
} from '@mui/material'

function Welcome() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && nickname) {
      localStorage.setItem('user', JSON.stringify({ email, nickname }))
      navigate('/products')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Gift Code Shop
      </Typography>
      
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Purchase gift codes quickly and easily. Choose from various denominations
            and get instant access to your codes.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Nickname"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Continue
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Welcome
