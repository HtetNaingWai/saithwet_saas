import { useCallback, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import AuthDialog from '../auth/AuthDialog'

const links = ['#features', '#how-it-works', '#plans', '#faq']
export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#top" aria-label="SaiThwet home"><img className="brand-mark saithwet-logo-mark" src="/saithwet-soft-blue-icon.svg" alt=""/><span className="brand-name">SaiThwet<small>ဆိုင်သွက်</small></span></a>
}
export default function Header({ onEnterDemo }: { onEnterDemo: (name: string) => void }) {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const closeDialog = useCallback(() => setAuthMode(null), [])
  const labels = language === 'my' ? { login: 'ဝင်ရန်', register: 'အကောင့်ဖွင့်ရန်', demo: 'Demo session', logout: 'ထွက်ရန်', light: 'အလင်းရောင် theme ပြောင်းရန်', dark: 'အမှောင်ရောင် theme ပြောင်းရန်' } : { login: 'Log in', register: 'Register', demo: 'Demo session', logout: 'Exit demo', light: 'Switch to light theme', dark: 'Switch to dark theme' }
  return <><header className="header"><div className="container header-inner"><Brand />
    <nav className={`navigation ${open ? 'navigation-open' : ''}`} aria-label="Main navigation">{links.map((link, i) => <a key={link} href={link} onClick={() => setOpen(false)}>{t.nav[i]}</a>)}</nav>
    <div className="header-actions"><button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'light' ? labels.dark : labels.light} title={theme === 'light' ? labels.dark : labels.light}>
      {theme === 'light' ? <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 15.2A8 8 0 0 1 8.8 4 8.1 8.1 0 1 0 20 15.2Z"/></svg> : <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>}
      </button><div className="language-switch" role="group" aria-label={t.language}><button type="button" className={language === 'my' ? 'selected' : ''} aria-pressed={language === 'my'} onClick={() => setLanguage('my')}>မြန်မာ</button><button type="button" className={language === 'en' ? 'selected' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button></div>
      <div className="auth-actions"><button className="auth-login" type="button" onClick={() => setAuthMode('login')}>{labels.login}</button><button className="button button-dark auth-register" type="button" onClick={() => setAuthMode('register')}>{labels.register}</button></div>
      <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t.menuClose : t.menuOpen}><span></span><span></span></button></div>
  </div></header>{authMode && <AuthDialog mode={authMode} onClose={closeDialog} onModeChange={setAuthMode} onComplete={(name) => { closeDialog(); onEnterDemo(name) }}/>}</>
}
