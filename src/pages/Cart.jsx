import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Snackbar,
  Stack
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import SteamIcon from '@mui/icons-material/SportsEsports'
import PlayStationIcon from '@mui/icons-material/Games'
import XboxIcon from '@mui/icons-material/Gamepad'
import AppleIcon from '@mui/icons-material/Apple'
import { sendTelegramNotification, testTelegramConnection } from '../utils/telegram'

function Cart() {
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Добавляем обработку ошибок при чтении корзины
  let cart = []
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]')
    console.log('Cart loaded:', cart) // Отладочный лог
  } catch (error) {
    console.error('Error loading cart:', error)
  }

  let user = {}
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}')
  } catch (error) {
    console.error('Error loading user:', error)
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const totalRub = total * 117

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'steam':
        return <SteamIcon />
      case 'playstation':
        return <PlayStationIcon />
      case 'xbox':
        return <XboxIcon />
      case 'apple':
        return <AppleIcon />
      default:
        return <ShoppingCartIcon />
    }
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    try {
      await testTelegramConnection()
      alert('Тестовое сообщение успешно отправлено!')
    } catch (error) {
      alert('Ошибка при отправке: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    try {
      const orderDetails = cart.map(item => 
        `${item.product.name} - $${item.price} (₽${item.price * 117})`
      ).join('\n')

      const message = `
📦 Новый заказ!

👤 Покупатель:
Имя: ${user.nickname}
Email: ${user.email}

🛍️ Заказ:
${orderDetails}

💰 Итого: $${total} (₽${totalRub})
      `.trim()

      await sendTelegramNotification(message)
      setOrderPlaced(true)
      localStorage.removeItem('cart')
    } catch (error) {
      alert('Ошибка при оформлении заказа: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueShopping = () => {
    navigate('/products')
  }

  if (!cart.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ваша корзина пуста
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleContinueShopping}
          sx={{ mt: 2 }}
        >
          Перейти к покупкам
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Ваша корзина
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemIcon sx={{ color: item.product.color }}>
                  {getIcon(item.product.iconName)}
                </ListItemIcon>
                <ListItemText
                  primary={item.product.name}
                  secondary={`$${item.price} (₽${item.price * 117})`}
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    Итого: ${total} (₽{totalRub})
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleContinueShopping}
            startIcon={<ArrowBackIcon />}
          >
            Продолжить покупки
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handlePlaceOrder}
            startIcon={<CheckCircleIcon />}
            disabled={isLoading}
          >
            {isLoading ? 'Оформление...' : 'Подтвердить заказ'}
          </Button>
        </Stack>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleTestConnection}
          startIcon={<SendIcon />}
          disabled={isLoading}
        >
          Проверить подключение к Telegram
        </Button>
      </Stack>

      <Snackbar
        open={orderPlaced}
        autoHideDuration={6000}
        onClose={() => setOrderPlaced(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Заказ успешно оформлен! Наш менеджер свяжется с вами в ближайшее время.
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Cart
