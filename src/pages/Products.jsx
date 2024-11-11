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
import SteamIcon from '@mui/icons-material/SportsEsports'
import PlayStationIcon from '@mui/icons-material/Games'
import XboxIcon from '@mui/icons-material/Gamepad'
import AppleIcon from '@mui/icons-material/Apple'
import CloseIcon from '@mui/icons-material/Close'

const giftCodes = [
  {
    id: 1,
    name: 'Steam',
    description: 'Пополнение кошелька Steam для покупки игр, дополнений и предметов',
    icon: <SteamIcon sx={{ fontSize: 40 }} />,
    color: '#171a21',
    prices: [10, 15, 20, 30, 40, 50]
  },
  {
    id: 2,
    name: 'PlayStation Store',
    description: 'Подарочная карта для покупок игр и дополнений в PlayStation Store',
    icon: <PlayStationIcon sx={{ fontSize: 40 }} />,
    color: '#006FCD',
    prices: [10, 15, 20, 30, 40, 50]
  },
  {
    id: 3,
    name: 'Xbox Live',
    description: 'Подарочная карта для покупок в Microsoft Store и Xbox Live',
    icon: <XboxIcon sx={{ fontSize: 40 }} />,
    color: '#107C10',
    prices: [10, 15, 20, 30, 40, 50]
  },
  {
    id: 4,
    name: 'Apple Store',
    description: 'Подарочная карта для App Store, iTunes, Apple Music и других сервисов Apple',
    icon: <AppleIcon sx={{ fontSize: 40 }} />,
    color: '#A2AAAD',
    prices: [10, 15, 20, 30, 40, 50]
  }
]

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
    const cartItem = {
      product: selectedProduct,
      price,
      id: `${selectedProduct.id}-${price}`
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    setDialogOpen(false)
    navigate('/cart')
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Выберите подарочную карту
      </Typography>

      <Grid container spacing={3}>
        {giftCodes.map((code) => (
          <Grid item xs={12} sm={6} md={4} key={code.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
              onClick={() => handleProductClick(code)}
            >
              <CardContent>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    color: code.color
                  }}
                >
                  {code.icon}
                  <Typography variant="h6">
                    {code.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {code.description}
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
                  Выберите номинал карты
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
