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
  IconButton
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AppleIcon from '@mui/icons-material/Apple'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PaymentsIcon from '@mui/icons-material/Payments'
import CloseIcon from '@mui/icons-material/Close'

const paymentMethods = [
  {
    id: 1,
    name: 'VISA / Mastercard',
    description: 'Оплата банковской картой VISA или Mastercard',
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
  },
  {
    id: 3,
    name: 'Банковский перевод',
    description: 'Прямой перевод на банковский счет',
    iconName: 'bank',
    color: '#2E7D32', // Green
    prices: [10, 15, 20, 30, 40, 50]
  },
  {
    id: 4,
    name: 'Электронный кошелек',
    description: 'Оплата через электронные платежные системы',
    iconName: 'wallet',
    color: '#1976D2', // Blue
    prices: [10, 15, 20, 30, 40, 50]
  }
]

const getIconComponent = (iconName, size = 40) => {
  switch (iconName) {
    case 'card':
      return <CreditCardIcon sx={{ fontSize: size }} />
    case 'apple':
      return <AppleIcon sx={{ fontSize: size }} />
    case 'bank':
      return <AccountBalanceIcon sx={{ fontSize: size }} />
    case 'wallet':
      return <PaymentsIcon sx={{ fontSize: size }} />
    default:
      return null
  }
}

function Products() {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const formatRubles = (dollars) => {
    return (dollars * 117).toLocaleString('ru-RU')
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
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

      <Grid container spacing={3}>
        {paymentMethods.map((method) => (
          <Grid item xs={12} sm={6} md={4} key={method.id}>
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

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        {selectedProduct && (
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

