import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext()

const defaultStrings = {
  sv: {
    brand: 'Bambu & Co',
    nav: {
      home: 'Hem',
      shop: 'Shop',
      about: 'Om oss',
      sustainability: 'Hållbarhet',
      sizeguide: 'Storleksguide',
      blog: 'Blogg',
      faq: 'FAQ',
      contact: 'Kontakt',
      account: 'Mitt konto',
      cart: 'Kundvagn',
      search: 'Sök produkter...'
    },
    cta_shop_now: 'Shoppa nu',
    featured: 'Utvalda produkter',
    bestsellers: 'Bästsäljare',
    new: 'Nyheter',
    sustainability_cta: 'Hållbarhet',
    add_to_cart: 'Lägg i varukorg',
    buy_now: 'Köp nu',
    checkout: 'Till kassan',
    subtotal: 'Delsumma',
    empty_cart: 'Din varukorg är tom',
    size: 'Storlek',
    color: 'Färg',
    price: 'Pris',
    filters: 'Filter',
    sort_by: 'Sortera',
    newsletter: 'Prenumerera på nyhetsbrev',
    email: 'E-post',
    subscribe: 'Prenumerera',
    cookie_message: 'Vi använder cookies för att förbättra din upplevelse. Godkänner du?',
    accept: 'Acceptera',
    decline: 'Avböj',
    seo_default_title: 'Bambu & Co — Mjuka, hållbara bambukläder',
    seo_default_description: 'Bambu & Co designar bekväma, hållbara kläder i bambuviskos. Fri frakt över 800 kr.'
  },
  en: {
    brand: 'Bambu & Co',
    nav: {
      home: 'Home',
      shop: 'Shop',
      about: 'About',
      sustainability: 'Sustainability',
      sizeguide: 'Size Guide',
      blog: 'Blog',
      faq: 'FAQ',
      contact: 'Contact',
      account: 'My account',
      cart: 'Cart',
      search: 'Search products...'
    },
    cta_shop_now: 'Shop now',
    featured: 'Featured products',
    bestsellers: 'Bestsellers',
    new: 'New in',
    sustainability_cta: 'Sustainability',
    add_to_cart: 'Add to cart',
    buy_now: 'Buy now',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    empty_cart: 'Your cart is empty',
    size: 'Size',
    color: 'Color',
    price: 'Price',
    filters: 'Filters',
    sort_by: 'Sort by',
    newsletter: 'Subscribe to newsletter',
    email: 'Email',
    subscribe: 'Subscribe',
    cookie_message: 'We use cookies to improve your experience. Do you accept?',
    accept: 'Accept',
    decline: 'Decline',
    seo_default_title: 'Bambu & Co — Soft, sustainable bamboo clothing',
    seo_default_description: 'Bambu & Co designs comfortable, sustainable bamboo viscose clothing.'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('sv')
  const [strings, setStrings] = useState(defaultStrings)

  useEffect(() => {
    const saved = localStorage.getItem('bambu_lang')
    if (saved) setLang(saved)
  }, [])

  const value = useMemo(() => ({
    lang,
    t: (path) => {
      const parts = path.split('.')
      return parts.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), strings[lang])
    },
    setLang: (l) => { setLang(l); localStorage.setItem('bambu_lang', l) },
    setStrings
  }), [lang, strings])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
