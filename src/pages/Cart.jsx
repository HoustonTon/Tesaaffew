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
import DoneIcon from '@mui/icons-material/Done'
import { sendTelegramNotification, testTelegramConnection } from '../utils/telegram'

function Cart() {
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
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
      setOrderPlaced(true)
      setSuccessDialogOpen(true)
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

      {/* Диалог успешного оформления заказа */}
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <DoneIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Спасибо за заказ!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Наш менеджер свяжется с {user.nickname} в течение нескольких минут
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSuccessClose}
            startIcon={<ShoppingCartIcon />}
          >
            Вернуться к покупкам
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={orderPlaced}
        autoHideDuration={6000}
        onClose={() => setOrderPlaced(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Заказ успешно оформлен!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Cart
