import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Link
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AppleIcon from '@mui/icons-material/Apple'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

const paymentMethods = [
  {
    id: 1,
    name: 'VISA Prepaid',
    description: 'Оплата банковской картой VISA',
    iconName: 'card',
    color: '#1a1f71', // VISA blue
    prices: [10, 15, 20, 30, 40, 50]
  },
  {
    id: 2,
    name: 'Apple Pay',
    description: 'Быстрая оплата через Apple Pay',
    iconName: 'apple',
    color: '#000000',
    prices: [10, 15, 20, 30, 40, 50]
  }
]

const getIconComponent = (iconName, size = 40) => {
  switch (iconName) {
    case 'card':
      return <CreditCardIcon sx={{ fontSize: size }} />
    case 'apple':
      return <AppleIcon sx={{ fontSize: size }} />
    default:
      return null
  }
}

function Products() {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)

  const formatRubles = (dollars) => {
    return (dollars * 117).toLocaleString('ru-RU')
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    if (product.iconName === 'card') {
      setInfoDialogOpen(true)
    } else {
      setDialogOpen(true)
    }
  }

  const handleAddToCart = (price) => {
    try {
      const cartItem = {
        product: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          iconName: selectedProduct.iconName,
          color: selectedProduct.color
        },
        price,
        id: `${selectedProduct.id}-${price}`
      }
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart.push(cartItem)
      localStorage.setItem('cart', JSON.stringify(cart))
      setDialogOpen(false)
      setInfoDialogOpen(false)
      navigate('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Произошла ошибка при добавлении в корзину')
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Выберите способ оплаты
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {paymentMethods.map((method) => (
          <Grid item xs={12} sm={6} md={5} key={method.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => handleProductClick(method)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    color: method.color
                  }}
                >
                  {getIconComponent(method.iconName)}
                  <Typography variant="h6">
                    {method.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {method.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Информационное окно для VISA */}
      <Dialog 
        open={infoDialogOpen} 
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardIcon sx={{ color: '#1a1f71' }} />
              Visa Prepaid (США)
            </Typography>
            <IconButton onClick={() => setInfoDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              Предоплаченная карта Visa от зарубежного банка, поддерживающая безопасные платежи с помощью 3D-Secure 🔐.
            </Typography>
            <Typography variant="body1" paragraph>
              Для успешной регистрации и оплаты используйте электронную почту с международным доменом, например gmail.com.
            </Typography>
            <Typography variant="body1" paragraph>
              Все операции проводите через VPN, соответствующий указанному биллинговому адресу, чтобы гарантировать корректную работу карты при оплате и привязке к сервисам.
            </Typography>
          </Box>

          <Link 
            href="https://telegra.ph/Polnyj-spisok-servisov-podderzhivayushchih-oplatu-predoplachennoj-kartoj-Visa-Prepaid-11-12"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <HelpOutlineIcon />
            <Typography>
              Как пользоваться
            </Typography>
          </Link>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Выберите номинал карты:
            </Typography>
            <Grid container spacing={2}>
              {selectedProduct?.prices.map((price) => (
                <Grid item xs={6} key={price}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAddToCart(price)}
                    sx={{ 
                      height: '100%',
                      borderColor: '#1a1f71',
                      color: '#1a1f71',
                      '&:hover': {
                        borderColor: '#1a1f71',
                        backgroundColor: 'rgba(26, 31, 113, 0.1)'
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="h6">${price}</Typography>
                      <Typography variant="caption" display="block">
                        ₽{formatRubles(price)}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Диалог выбора суммы для Apple Pay */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        {selectedProduct && selectedProduct.iconName === 'apple' && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  Выберите сумму
                </Typography>
                <IconButton onClick={() => setDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {selectedProduct.prices.map((price) => (
                  <Grid item xs={6} key={price}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleAddToCart(price)}
                      sx={{ 
                        height: '100%',
                        borderColor: selectedProduct.color,
                        color: selectedProduct.color,
                        '&:hover': {
                          borderColor: selectedProduct.color,
                          backgroundColor: `${selectedProduct.color}10`
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="h6">${price}</Typography>
                        <Typography variant="caption" display="block">
                          ₽{formatRubles(price)}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default Products
