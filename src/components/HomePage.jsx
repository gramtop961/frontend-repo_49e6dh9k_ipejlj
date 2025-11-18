import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLang } from './LanguageProvider'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function HomePage(){
  const { t } = useLang()
  const [products, setProducts] = useState([])

  useEffect(()=>{
    fetch(`${API}/products`).then(r=>r.json()).then(setProducts).catch(()=>{})
  },[])

  return (
    <Layout>
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-emerald-900 mb-4">Mjuka, hållbara bambukläder — bra för dig och planeten.</h1>
            <p className="text-slate-700 mb-6">Bekväma basplagg i bambuviskos som andas. Fri frakt över 800 kr.</p>
            <a href="/shop" className="inline-block bg-emerald-800 text-white px-5 py-3 rounded-md">{t('cta_shop_now')}</a>
          </div>
          <div className="aspect-[4/3] bg-[url('/images/hero-bamboo.webp')] bg-cover bg-center rounded-xl shadow-inner" aria-label="Hero image"></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold text-emerald-900 mb-4">{t('featured')}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.slice(0,3).map(p=> (
            <a key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="aspect-square bg-slate-100 overflow-hidden">
                <img src={p.images?.[0]} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition"/>
              </div>
              <div className="p-4">
                <div className="text-slate-900 font-medium">{p.title}</div>
                <div className="text-emerald-800 font-semibold">{p.price} SEK</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold text-emerald-900 mb-4">Omdömen</h2>
        <div className="grid md:grid-cols-3 gap-6 text-slate-700">
          <blockquote className="bg-white p-5 rounded-xl border">“Otroligt mjuk kvalitet!” — Lina</blockquote>
          <blockquote className="bg-white p-5 rounded-xl border">“Snabb leverans och fint passform.” — Amir</blockquote>
          <blockquote className="bg-white p-5 rounded-xl border">“Min nya favorit-tshirt.” — Sara</blockquote>
        </div>
      </section>
    </Layout>
  )
}
