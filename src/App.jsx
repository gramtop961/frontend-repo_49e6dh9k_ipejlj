import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './components/LanguageProvider'
import HomePage from './components/HomePage'
import ShopPage from './components/ShopPage'
import ProductPage from './components/ProductPage'
import CartCheckout from './components/CartCheckout'

function App(){
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/shop" element={<ShopPage/>} />
        <Route path="/product/:id" element={<ProductPage/>} />
        <Route path="/checkout" element={<CartCheckout/>} />
      </Routes>
    </LanguageProvider>
  )
}

export default App
