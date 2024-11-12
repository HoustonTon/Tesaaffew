import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

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

  const handleSocialLogin = (platform) => {
    alert(`Вход через ${platform} будет доступен в ближайшее время`)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        py: 4,
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}
        >
          {/* Логотип */}
          <Box 
            sx={{ 
              width: '100%',
              maxWidth: 300,
              mb: 2,
              animation: 'fadeInDown 0.8s ease-out'
            }}
          >
            <img 
              src="https://i.imgur.com/NXm3qnt.png" 
              alt="Company Logo" 
              style={{ 
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </Box>

          {/* Основные преимущества */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            sx={{ width: '100%', mb: 4 }}
          >
            {[
              {
                title: 'Безопасно',
                description: 'Гарантируем безопасность каждой покупки'
              },
              {
                title: 'Выгодно',
                description: 'Лучшие цены и постоянные акции'
              },
              {
                title: 'Поддержка 24/7',
                description: 'Всегда готовы помочь с любым вопросом'
              }
            ].map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: `fadeIn 0.5s ease-out ${index * 0.2}s`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {/* Форма регистрации */}
          <Card 
            sx={{ 
              maxWidth: 500,
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              bgcolor: 'background.paper',
              overflow: 'visible',
              animation: 'fadeIn 0.5s ease-out 0.6s both'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                Добро пожаловать!
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
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Ваш никнейм Telegram"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    fullWidth
                    variant="outlined"
                    helperText="Укажите ваш @username в Telegram для связи"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                      }
                    }}
                  >
                    Начать покупки
                  </Button>
                </Stack>
              </form>

              <Divider sx={{ my: 3 }}>или</Divider>

              <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton 
                  onClick={() => handleSocialLogin('Google')}
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    '&:hover': { bgcolor: '#e0e0e0' }
                  }}
                >
                  <GoogleIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleSocialLogin('Facebook')}
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    '&:hover': { bgcolor: '#e0e0e0' }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>

          {/* Футер */}
          <Box 
            component="footer" 
            sx={{ 
              mt: 4, 
              textAlign: 'center',
              width: '100%',
              animation: 'fadeIn 0.5s ease-out 0.8s both'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2024 GameKeys Store. Все права защищены.
            </Typography>
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              sx={{ mt: 1 }}
            >
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer' }}
              >
                Политика конфиденциальности
              </Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer' }}
              >
                Условия использования
              </Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer' }}
              >
                Контакты
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* CSS для анимаций */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  )
}

export default Welcome
