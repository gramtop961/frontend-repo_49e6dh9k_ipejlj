import React, { useEffect, useMemo, useState } from 'react'
import Layout from './Layout'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ShopPage(){
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')

  useEffect(()=>{
    const url = new URL(`${API}/products`)
    if (q) url.searchParams.set('q', q)
    if (category) url.searchParams.set('category', category)
    if (sort) url.searchParams.set('sort', sort)
    fetch(url).then(r=>r.json()).then(setProducts).catch(()=>{})
  }, [q, category, sort])

  return (
    <Layout onSearch={setQ}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <select className="border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Alla kategorier</option>
            <option value="T-shirt">T-shirt</option>
            <option value="Tröja">Tröja</option>
            <option value="Byxor">Byxor</option>
            <option value="Underkläder">Underkläder</option>
            <option value="Accessoarer">Accessoarer</option>
          </select>
          <select className="border rounded px-3 py-2 ml-auto" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="">Relevans</option>
            <option value="new">Nyheter</option>
            <option value="price_asc">Pris, lägst först</option>
            <option value="price_desc">Pris, högst först</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(p => (
            <a key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-xl border overflow-hidden">
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
    </Layout>
  )
}
