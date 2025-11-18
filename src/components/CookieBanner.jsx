import React, { useEffect, useState } from 'react'
import { useLang } from './LanguageProvider'

export default function CookieBanner(){
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    const v = localStorage.getItem('bambu_cookie_consent')
    if(!v) setVisible(true)
  }, [])

  const decide = (val)=>{
    localStorage.setItem('bambu_cookie_consent', val)
    setVisible(false)
  }

  if(!visible) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-4 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-slate-700 pr-4">{t('cookie_message')}</p>
          <div className="mt-3 sm:mt-0 flex gap-2">
            <button onClick={()=>decide('decline')} className="px-4 py-2 rounded border text-slate-700">{t('decline')}</button>
            <button onClick={()=>decide('accept')} className="px-4 py-2 rounded bg-emerald-800 text-white">{t('accept')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
