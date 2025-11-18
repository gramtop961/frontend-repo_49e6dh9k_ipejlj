import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './components/LanguageProvider'
import HomePage from './components/HomePage'
import ShopPage from './components/ShopPage'
import ProductPage from './components/ProductPage'
import CartCheckout from './components/CartCheckout'
import AdminPanel from './components/AdminPanel'
import Account from './components/Account'
import OrderStatus from './components/OrderStatus'

function App(){
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/shop" element={<ShopPage/>} />
        <Route path="/product/:id" element={<ProductPage/>} />
        <Route path="/checkout" element={<CartCheckout/>} />
        <Route path="/order" element={<OrderStatus/>} />
        <Route path="/admin" element={<AdminPanel/>} />
        <Route path="/account" element={<Account/>} />
      </Routes>
    </LanguageProvider>
  )
}

export default App
