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
  Stack,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AppleIcon from '@mui/icons-material/Apple'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { sendTelegramNotification, testTelegramConnection } from '../utils/telegram'

function Cart() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  
  let cart = []
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]')
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
      case 'card':
        return <CreditCardIcon />
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
Telegram: ${user.nickname}
Email: ${user.email}

💳 Заказ:
${orderDetails}

💰 Итого: $${total} (₽${totalRub})
      `.trim()

      await sendTelegramNotification(message)
      localStorage.removeItem('cart')
      setSuccessDialogOpen(true)
    } catch (error) {
      alert('Ошибка при оформлении заказа: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueShopping = () => {
    navigate('/products')
  }

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false)
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
          Выбрать способ оплаты
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Корзина
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
      </Box>

      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogContent>
          <Box sx={{ 
            textAlign: 'center', 
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <TaskAltIcon sx={{ 
              fontSize: 80, 
              color: 'success.main',
              animation: 'fadeIn 0.5s ease-out'
            }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Спасибо за заказ!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 400 }}>
              Наш менеджер свяжется с <strong>{user.nickname}</strong> в течение нескольких минут
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSuccessClose}
            size="large"
            startIcon={<ShoppingCartIcon />}
          >
            Вернуться к покупкам
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </>
  )
}

export default Cart
