import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { content, type Language } from '../data/content'

type LanguageContextValue = { language: Language; setLanguage: (value: Language) => void; t: (typeof content)[Language] }
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // The preference stays in this browser; there is no user account or backend.
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('saithwet-language') === 'en' ? 'en' : 'my' } catch { return 'my' }
  })
  useEffect(() => {
    document.documentElement.lang = language
    try { localStorage.setItem('saithwet-language', language) } catch { /* Browsing can continue without storage. */ }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage, t: content[language] }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used within LanguageProvider')
  return value
}
