import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Menu, Search } from 'lucide-react'
import { useLang } from './LanguageProvider'
import CookieBanner from './CookieBanner'

export default function Layout({ children, cartCount = 0, onSearch }) {
  const { t, lang, setLang } = useLang()
  const nav = t('nav')

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-slate-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button className="sm:hidden p-2" aria-label="menu"><Menu className="w-6 h-6"/></button>
          <Link to="/" className="font-semibold tracking-tight text-xl text-emerald-800">Bambu & Co</Link>
          <nav className="hidden sm:flex gap-5 ml-6 text-sm">
            <NavLink to="/" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.home}</NavLink>
            <NavLink to="/shop" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.shop}</NavLink>
            <NavLink to="/about" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.about}</NavLink>
            <NavLink to="/sustainability" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.sustainability}</NavLink>
            <NavLink to="/size-guide" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.sizeguide}</NavLink>
            <NavLink to="/blog" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.blog}</NavLink>
            <NavLink to="/faq" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.faq}</NavLink>
            <NavLink to="/contact" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>{nav.contact}</NavLink>
            <NavLink to="/admin" className={({isActive})=>isActive? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}>Admin</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/>
              <input aria-label="search" onChange={(e)=>onSearch?.(e.target.value)} className="pl-9 pr-3 py-2 rounded-full bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder={nav.search}/>
            </div>
            <select aria-label="language" value={lang} onChange={e=>setLang(e.target.value)} className="text-sm bg-white border rounded px-2 py-1">
              <option value="sv">SV</option>
              <option value="en">EN</option>
            </select>
            <Link to="/cart" aria-label="cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6"/>
              {cartCount>0 && <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-xs rounded-full px-1">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-[#F1F1EC] border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-semibold text-emerald-900 mb-2">Bambu & Co</div>
            <p className="text-slate-600">Mjuka, hållbara bambukläder — bra för dig och planeten.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Info</div>
            <ul className="space-y-1 text-slate-600">
              <li><Link to="/privacy">Integritetspolicy</Link></li>
              <li><Link to="/terms">Villkor</Link></li>
              <li><Link to="/returns">Retur & Byten</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Kundservice</div>
            <ul className="space-y-1 text-slate-600">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Nyhetsbrev</div>
            <form className="flex gap-2">
              <input type="email" aria-label="email" placeholder="E-post" className="flex-1 bg-white border rounded px-3 py-2"/>
              <button className="bg-emerald-800 text-white rounded px-4">OK</button>
            </form>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 py-4">© {new Date().getFullYear()} Bambu & Co</div>
      </footer>
      <CookieBanner />
    </div>
  )
}
