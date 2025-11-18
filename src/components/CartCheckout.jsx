import React, { useEffect, useMemo, useState } from 'react'
import Layout from './Layout'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CartCheckout(){
  const [items, setItems] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('bambu_cart')||'[]') }catch{ return [] }
  })
  const [country, setCountry] = useState('SE')
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState('standard')
  const [address, setAddress] = useState({first_name:'', last_name:'', address1:'', address2:'', postal_code:'', city:'', country:'SE'})
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ localStorage.setItem('bambu_cart', JSON.stringify(items)) }, [items])
  useEffect(()=>{
    (async()=>{
      try{
        const res = await fetch(`${API}/settings`)
        const data = await res.json()
        setSettings(data)
      }catch(e){ /* ignore */ }
    })()
  }, [])

  const subtotal = items.reduce((s,i)=> s + i.price * i.qty, 0)
  const taxRate = country==='SE' ? 0.25 : 0.0
  const tax = +(subtotal * taxRate).toFixed(2)
  const shippingCost = country==='SE' ? (subtotal>=800?0:49) : (country==='EU' ? (subtotal>=1200?0:99) : 149)
  const total = subtotal + tax + shippingCost

  const baseOrder = {
    line_items: items.map(i=>({product_id:i.product_id, sku:i.sku, qty:i.qty, price:i.price})),
    totals: {subtotal, tax, shipping: shippingCost, total},
    shipping_address: address,
    billing_address: address,
  }

  const placeOrderDemo = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const order = { ...baseOrder, payment_info: {method:'test', status:'pending'} }
      const res = await fetch(`${API}/orders`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(order)})
      const data = await res.json()
      alert(`Order skapad: ${data.order_number}`)
      setItems([])
    } finally { setLoading(false) }
  }

  const payWithStripe = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const success = window.location.origin + '/checkout'
      const cancel = window.location.href
      const payload = { ...baseOrder, locale: 'sv', success_url: success, cancel_url: cancel }
      const res = await fetch(`${API}/payments/stripe/checkout`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
      if(!res.ok){
        const msg = await res.text()
        alert('Kunde inte initiera Stripe: ' + msg)
        return
      }
      const data = await res.json()
      if(data.url){ window.location.href = data.url }
    } finally { setLoading(false) }
  }

  const stripeEnabled = !!settings?.payment?.stripe_public && !!settings?.payment?.stripe_secret

  return (
    <Layout cartCount={items.length}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Kassa</h1>
          <form className="space-y-4">
            <input required placeholder="E-post" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Förnamn" className="border rounded px-3 py-2" value={address.first_name} onChange={e=>setAddress({...address, first_name:e.target.value})}/>
              <input required placeholder="Efternamn" className="border rounded px-3 py-2" value={address.last_name} onChange={e=>setAddress({...address, last_name:e.target.value})}/>
            </div>
            <input required placeholder="Adress" className="w-full border rounded px-3 py-2" value={address.address1} onChange={e=>setAddress({...address, address1:e.target.value})}/>
            <input placeholder="Adress rad 2" className="w-full border rounded px-3 py-2" value={address.address2} onChange={e=>setAddress({...address, address2:e.target.value})}/>
            <div className="grid grid-cols-3 gap-3">
              <input required placeholder="Postnummer" className="border rounded px-3 py-2" value={address.postal_code} onChange={e=>setAddress({...address, postal_code:e.target.value})}/>
              <input required placeholder="Ort" className="border rounded px-3 py-2" value={address.city} onChange={e=>setAddress({...address, city:e.target.value})}/>
              <select className="border rounded px-3 py-2" value={country} onChange={e=>{setCountry(e.target.value); setAddress({...address, country:e.target.value})}}>
                <option value="SE">Sverige</option>
                <option value="EU">EU</option>
                <option value="WORLD">Världen</option>
              </select>
            </div>
            <div>
              <div className="font-medium mb-2">Frakt</div>
              <label className="flex items-center gap-2"><input type="radio" checked={shipping==='standard'} onChange={()=>setShipping('standard')}/> Standard (2–5 vardagar)</label>
              <label className="flex items-center gap-2"><input type="radio" checked={shipping==='express'} onChange={()=>setShipping('express')}/> Express (1–2 vardagar)</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={placeOrderDemo} disabled={loading} className="bg-emerald-800 text-white rounded px-5 py-3 disabled:opacity-60">Betala (demo)</button>
              {stripeEnabled && (
                <button onClick={payWithStripe} disabled={loading} className="bg-black text-white rounded px-5 py-3 disabled:opacity-60">Betala med kort (Stripe)</button>
              )}
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Din kundvagn</h2>
          {items.length===0 && <div className="text-slate-600">Tom</div>}
          <ul className="space-y-3">
            {items.map((i,idx)=> (
              <li key={idx} className="flex justify-between items-center bg-white p-3 rounded border">
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-slate-600">{i.qty} × {i.price} SEK</div>
                </div>
                <button onClick={()=>setItems(items.filter((_,x)=>x!==idx))} className="text-sm text-red-600">Ta bort</button>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-1 text-sm text-slate-700">
            <div className="flex justify-between"><span>Delsumma</span><span>{subtotal.toFixed(2)} SEK</span></div>
            <div className="flex justify-between"><span>Moms</span><span>{tax.toFixed(2)} SEK</span></div>
            <div className="flex justify-between"><span>Frakt</span><span>{shippingCost.toFixed(2)} SEK</span></div>
            <div className="flex justify-between font-semibold text-emerald-900"><span>Att betala</span><span>{total.toFixed(2)} SEK</span></div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
