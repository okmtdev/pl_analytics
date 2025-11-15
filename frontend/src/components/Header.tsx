import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import premierLogo from '../assets/Premier League Logo.svg'


const Header: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // On mount, apply saved language from localStorage if present
    const saved = localStorage.getItem('preferredLanguage')
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved)
    }
  }, [i18n])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  function changeLanguage(lang: 'ja' | 'en') {
    i18n.changeLanguage(lang)
    try {
      localStorage.setItem('preferredLanguage', lang)
    } catch (e) {
      // ignore storage errors
    }
    setOpen(false)
  }

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img 
          src={premierLogo} 
          alt="Premier League" 
          className="h-10 brightness-0 invert"
        />
        <a className="text-white font-bold">{t('title')}</a>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 bg-white/10 rounded-md px-3 py-2 text-white">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">A</span>
            <span className="text-sm">{t('no_login')}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg text-sm z-20">
              <div className="px-3 py-2 border-b">{t('account_settings')}</div>
              <div className="px-3 py-2">
                <div className="text-xs text-gray-500 mb-2">{t('language')}</div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => changeLanguage('ja')}
                    className={`text-left px-2 py-1 rounded ${i18n.language === 'ja' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-gray-100'}`}>
                    日本語
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`text-left px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-gray-100'}`}>
                    English
                  </button>
                </div>
              </div>
              <div className="px-3 py-2 border-t text-xs text-gray-500">{t('signed_in_as')} demo@local</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
