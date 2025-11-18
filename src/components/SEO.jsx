import React, { useEffect } from 'react'

export default function SEO({ title, description, canonical, jsonLd }){
  useEffect(()=>{
    if(title) document.title = title
    const m = document.querySelector('meta[name="description"]') || (()=>{ const el=document.createElement('meta'); el.setAttribute('name','description'); document.head.appendChild(el); return el })()
    if(description) m.setAttribute('content', description)

    const link = document.querySelector('link[rel="canonical"]') || (()=>{ const el=document.createElement('link'); el.setAttribute('rel','canonical'); document.head.appendChild(el); return el })()
    if(canonical) link.setAttribute('href', canonical)

    if(jsonLd){
      let script = document.getElementById('jsonld')
      if(!script){ script = document.createElement('script'); script.type='application/ld+json'; script.id='jsonld'; document.head.appendChild(script) }
      script.textContent = JSON.stringify(jsonLd)
    }
  }, [title, description, canonical, jsonLd])
  return null
}
