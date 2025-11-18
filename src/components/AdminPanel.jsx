import React, { useEffect, useMemo, useState } from 'react'
import Layout from './Layout'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AdminPanel(){
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(null)
  const [filter, setFilter] = useState('')

  const load = async ()=>{
    const [ps, os, ss] = await Promise.all([
      fetch(`${API}/products`).then(r=>r.json()),
      fetch(`${API}/orders`).then(r=>r.json()),
      fetch(`${API}/settings`).then(r=>r.json())
    ])
    setProducts(ps); setOrders(os); setSettings(ss)
  }
  useEffect(()=>{ load() }, [])

  const startNew = ()=> setEditing({
    title:'', slug:'', category:'', short_description:'', long_description:'', price:0, SKU:'', inventory_quantity:0,
    variants:[], images:[], tags:[], material:'', care_instructions:'', shipping_class:'standard', tax_class:'SE25'
  })

  const saveProduct = async ()=>{
    const method = editing.id ? 'PUT' : 'POST'
    const url = editing.id ? `${API}/products/${editing.id}` : `${API}/products`
    const res = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing)})
    if(!res.ok){ alert('Failed to save'); return }
    await load(); setEditing(null)
  }

  const removeProduct = async (p)=>{
    if(!confirm('Ta bort produkt?')) return
    await fetch(`${API}/products/${p.id}`, {method:'DELETE'})
    await load()
  }

  const filtered = useMemo(()=> products.filter(p=> p.title.toLowerCase().includes(filter.toLowerCase())), [products, filter])

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-semibold text-emerald-900 mb-6">Admin</h1>

        <div className="flex gap-3 mb-6">
          <button onClick={()=>setTab('products')} className={`px-4 py-2 rounded border ${tab==='products'?'bg-emerald-800 text-white border-emerald-800':'bg-white'}`}>Produkter</button>
          <button onClick={()=>setTab('orders')} className={`px-4 py-2 rounded border ${tab==='orders'?'bg-emerald-800 text-white border-emerald-800':'bg-white'}`}>Ordrar</button>
          <button onClick={()=>setTab('settings')} className={`px-4 py-2 rounded border ${tab==='settings'?'bg-emerald-800 text-white border-emerald-800':'bg-white'}`}>Inställningar</button>
        </div>

        {tab==='products' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <input placeholder="Sök produkter" className="border rounded px-3 py-2" value={filter} onChange={e=>setFilter(e.target.value)}/>
                <button onClick={startNew} className="ml-auto bg-emerald-800 text-white rounded px-4 py-2">Ny produkt</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map(p=> (
                  <div key={p.id} className="bg-white border rounded p-3">
                    <div className="flex gap-3 items-center">
                      <img src={p.images?.[0]} alt="" className="w-16 h-16 object-cover rounded bg-slate-100"/>
                      <div className="flex-1">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-sm text-slate-600">{p.price} SEK • Lager {p.inventory_quantity}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>setEditing(p)} className="text-emerald-800">Redigera</button>
                        <button onClick={()=>removeProduct(p)} className="text-red-600">Ta bort</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {editing ? (
                <div className="bg-white border rounded p-4 space-y-3 sticky top-24">
                  <div className="font-medium mb-2">{editing.id ? 'Redigera' : 'Ny produkt'}</div>
                  <input className="w-full border rounded px-3 py-2" placeholder="Titel" value={editing.title} onChange={e=>setEditing({...editing, title:e.target.value})}/>
                  <input className="w-full border rounded px-3 py-2" placeholder="Slug" value={editing.slug} onChange={e=>setEditing({...editing, slug:e.target.value})}/>
                  <input className="w-full border rounded px-3 py-2" placeholder="Kategori" value={editing.category} onChange={e=>setEditing({...editing, category:e.target.value})}/>
                  <textarea className="w-full border rounded px-3 py-2" placeholder="Kort beskrivning" value={editing.short_description} onChange={e=>setEditing({...editing, short_description:e.target.value})}/>
                  <textarea className="w-full border rounded px-3 py-2" placeholder="Lång beskrivning" value={editing.long_description} onChange={e=>setEditing({...editing, long_description:e.target.value})}/>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" className="border rounded px-3 py-2" placeholder="Pris" value={editing.price} onChange={e=>setEditing({...editing, price: parseFloat(e.target.value)})}/>
                    <input className="border rounded px-3 py-2" placeholder="SKU" value={editing.SKU} onChange={e=>setEditing({...editing, SKU:e.target.value})}/>
                  </div>
                  <input type="number" className="w-full border rounded px-3 py-2" placeholder="Lager" value={editing.inventory_quantity} onChange={e=>setEditing({...editing, inventory_quantity: parseInt(e.target.value||'0')})}/>
                  <input className="w-full border rounded px-3 py-2" placeholder="Bild-URL" value={(editing.images?.[0])||''} onChange={e=>setEditing({...editing, images:[e.target.value]})}/>
                  <div className="flex gap-2">
                    <button onClick={saveProduct} className="bg-emerald-800 text-white rounded px-4 py-2">Spara</button>
                    <button onClick={()=>setEditing(null)} className="border rounded px-4 py-2">Avbryt</button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600">Välj en produkt att redigera eller skapa en ny.</div>
              )}
            </div>
          </div>
        )}

        {tab==='orders' && (
          <div className="bg-white border rounded p-4">
            <div className="font-medium mb-2">Ordrar</div>
            <div className="divide-y">
              {orders.map(o=> (
                <div key={o.id} className="py-3 flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{o.order_number}</div>
                    <div className="text-slate-600">{new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div>{o.totals?.total?.toFixed?.(2)} SEK</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='settings' && settings && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded p-4 space-y-3">
              <div className="font-medium">Betalningar</div>
              <input className="w-full border rounded px-3 py-2" placeholder="Stripe public" value={settings.payment.stripe_public} onChange={e=>setSettings({...settings, payment:{...settings.payment, stripe_public:e.target.value}})}/>
              <input className="w-full border rounded px-3 py-2" placeholder="Stripe secret" value={settings.payment.stripe_secret} onChange={e=>setSettings({...settings, payment:{...settings.payment, stripe_secret:e.target.value}})}/>
              <input className="w-full border rounded px-3 py-2" placeholder="PayPal client" value={settings.payment.paypal_client} onChange={e=>setSettings({...settings, payment:{...settings.payment, paypal_client:e.target.value}})}/>
              <input className="w-full border rounded px-3 py-2" placeholder="PayPal secret" value={settings.payment.paypal_secret} onChange={e=>setSettings({...settings, payment:{...settings.payment, paypal_secret:e.target.value}})}/>
            </div>
            <div className="bg-white border rounded p-4 space-y-3">
              <div className="font-medium">Analytics</div>
              <input className="w-full border rounded px-3 py-2" placeholder="GA4 Measurement ID" value={settings.analytics.ga4_measurement_id} onChange={e=>setSettings({...settings, analytics:{...settings.analytics, ga4_measurement_id:e.target.value}})}/>
              <input className="w-full border rounded px-3 py-2" placeholder="Facebook Pixel ID" value={settings.analytics.facebook_pixel_id} onChange={e=>setSettings({...settings, analytics:{...settings.analytics, facebook_pixel_id:e.target.value}})}/>
              <input className="w-full border rounded px-3 py-2" placeholder="Mailchimp API Key" value={settings.analytics.mailchimp_api_key} onChange={e=>setSettings({...settings, analytics:{...settings.analytics, mailchimp_api_key:e.target.value}})}/>
            </div>
            <div className="md:col-span-2 bg-white border rounded p-4 space-y-3">
              <div className="font-medium">Fraktzoner</div>
              {Object.entries(settings.shipping.zones).map(([key, z])=> (
                <div key={key} className="grid grid-cols-4 gap-2 items-center">
                  <div className="font-medium">{key}</div>
                  <input className="border rounded px-3 py-2" value={z.name} onChange={e=>setSettings({...settings, shipping:{...settings.shipping, zones:{...settings.shipping.zones, [key]:{...z, name:e.target.value}}}})}/>
                  <input type="number" className="border rounded px-3 py-2" value={z.rate} onChange={e=>setSettings({...settings, shipping:{...settings.shipping, zones:{...settings.shipping.zones, [key]:{...z, rate: parseFloat(e.target.value)}}}})}/>
                  <input type="number" className="border rounded px-3 py-2" value={z.free_over} onChange={e=>setSettings({...settings, shipping:{...settings.shipping, zones:{...settings.shipping.zones, [key]:{...z, free_over: parseFloat(e.target.value)}}}})}/>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={async ()=>{await fetch(`${API}/settings`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(settings)}); alert('Sparat!')}} className="bg-emerald-800 text-white rounded px-4 py-2">Spara</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
