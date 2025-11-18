import React, { useEffect, useState } from 'react'
import Layout from './Layout'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function OrderStatus(){
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Read order_id from query string
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    const id = params.get('order_id')
    if(!id){
      setError('Ingen order hittades.');
      setLoading(false)
      return
    }

    let cancel = false

    const fetchOrder = async ()=>{
      try{
        const res = await fetch(`${API}/orders/${id}`)
        if(!res.ok){
          throw new Error('Kunde inte hämta order')
        }
        const data = await res.json()
        if(!cancel){
          setOrder(data)
          setLoading(false)
        }
      }catch(e){
        if(!cancel){
          setError('Kunde inte hämta order. Försök igen senare.')
          setLoading(false)
        }
      }
    }

    // fetch immediately then poll a few times in case webhook updates status
    fetchOrder()
    const interval = setInterval(fetchOrder, 3000)
    setTimeout(()=> clearInterval(interval), 15000)

    return ()=>{ cancel = true; clearInterval(interval) }
  }, [])

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-semibold mb-6">Tack för din beställning</h1>
        {loading && (
          <div className="text-slate-600">Laddar orderstatus...</div>
        )}
        {error && (
          <div className="text-red-600">{error}</div>
        )}
        {order && (
          <div className="space-y-4 bg-white p-6 rounded border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Ordernummer</div>
                <div className="font-medium">{order.order_number}</div>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${order.status==='paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {order.status==='paid' ? 'Betald' : order.status==='pending' ? 'Väntar på betalning' : order.status}
              </span>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-1">Summa</div>
              <div className="text-lg font-semibold">{order?.totals?.total?.toFixed ? order.totals.total.toFixed(2) : order.totals.total} SEK</div>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-2">Varor</div>
              <ul className="space-y-2">
                {order.line_items?.map((li, idx)=> (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{li.qty} × {li.sku || li.product_id}</span>
                    <span>{(li.price*li.qty).toFixed(2)} SEK</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-slate-600">
              En orderbekräftelse skickas till din e-post. Vid frågor, kontakta vår support.
            </div>

            <div>
              <a href="/shop" className="inline-block mt-2 bg-emerald-800 text-white rounded px-4 py-2">Fortsätt handla</a>
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}