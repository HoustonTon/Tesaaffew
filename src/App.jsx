import { Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  )
}

export default App
