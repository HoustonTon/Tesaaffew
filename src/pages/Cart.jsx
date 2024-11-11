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
import { sendTelegramNotification } from '../utils/telegram'

function Cart() {
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const totalRub = total * 117

  const handlePlaceOrder = async () => {
    try {
      // Формируем текст сообщения для Telegram
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
      console.error('Error sending notification:', error)
    }
  }

  const handleContinueShopping = () => {
    navigate('/products')
  }

  if (cart.length === 0) {
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
                  {item.product.icon}
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
        >
          Подтвердить заказ
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
