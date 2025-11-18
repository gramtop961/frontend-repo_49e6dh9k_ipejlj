import React, { useEffect, useMemo, useState } from 'react'
import Layout from './Layout'
import { useParams } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProductPage(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')

  useEffect(()=>{
    fetch(`${API}/products/${id}`).then(r=>r.json()).then(setProduct)
  }, [id])

  const sizes = useMemo(()=> product?.variants?.find(v=>v.option_name.toLowerCase().includes('storlek'))?.option_values || [], [product])
  const colors = useMemo(()=> product?.variants?.find(v=>v.option_name.toLowerCase().includes('färg'))?.option_values || [], [product])

  if(!product) return <Layout><div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">Laddar...</div></Layout>

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
            <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover"/>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-emerald-900 mb-2">{product.title}</h1>
          <div className="text-xl text-emerald-800 font-semibold mb-3">{product.price} SEK</div>
          <div className="text-slate-600 mb-4">{product.short_description}</div>
          <div className="text-sm text-slate-600 mb-2">SKU: {product.SKU}</div>
          <div className="text-sm text-slate-600 mb-6">Lager: {product.inventory_quantity} st</div>

          {sizes.length>0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Storlek</div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(s => (
                  <button key={s} onClick={()=>setSize(s)} className={`px-3 py-1 rounded border ${size===s? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {colors.length>0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Färg</div>
              <div className="flex gap-2 flex-wrap">
                {colors.map(c => (
                  <button key={c} onClick={()=>setColor(c)} className={`px-3 py-1 rounded border ${color===c? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white'}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button className="bg-emerald-800 text-white rounded px-5 py-3">Lägg i varukorg</button>
            <a className="border border-emerald-800 text-emerald-800 rounded px-5 py-3" href="/checkout">Köp nu</a>
          </div>

          <div className="prose prose-slate mt-8">
            <h3>Beskrivning</h3>
            <p>{product.long_description}</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
