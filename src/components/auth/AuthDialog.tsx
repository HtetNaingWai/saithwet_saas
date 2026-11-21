import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLanguage } from '../../context/LanguageContext'

type Mode = 'login' | 'register'
type Props = { mode: Mode; onClose: () => void; onModeChange: (mode: Mode) => void; onComplete: (name: string) => void }

const copy = {
  my: {
    login: 'ပြန်လည်ကြိုဆိုပါတယ်', register: 'ဆိုင်သွက်နဲ့ စတင်လိုက်ပါ',
    loginSubtitle: 'သင့်ဆိုင်အတွက် demo workspace ကို ဆက်လက်ကြည့်ရှုပါ။', registerSubtitle: 'သင့်လုပ်ငန်းအတွက် ပိုသွက်တဲ့ နေ့ရက်တွေ စလိုက်ပါ။',
    loginTab: 'ဝင်ရန်', registerTab: 'အကောင့်ဖွင့်ရန်', name: 'နာမည်', namePlaceholder: 'သင့်နာမည်', email: 'အီးမေးလ်', password: 'စကားဝှက်', passwordPlaceholder: 'အနည်းဆုံး စာလုံး ၈ လုံး',
    loginButton: 'Demo ဝင်မယ်', registerButton: 'Demo အကောင့်ဖွင့်မယ်', noAccount: 'အကောင့် မရှိသေးဘူးလား?', hasAccount: 'အကောင့်ရှိပြီးသားလား?', close: 'ပိတ်ရန်',
    notice: 'Demo သာဖြစ်ပါသည်။ တကယ့် account ဖန်တီးခြင်း၊ password စစ်ဆေးခြင်းနှင့် သိမ်းဆည်းခြင်း မရှိပါ။ တကယ့် password မသုံးပါနှင့်။',
  },
  en: {
    login: 'Welcome back', register: 'Get started with SaiThwet',
    loginSubtitle: 'Continue exploring your demo workspace.', registerSubtitle: 'Start making more room for your business.',
    loginTab: 'Log in', registerTab: 'Register', name: 'Your name', namePlaceholder: 'Your name', email: 'Email address', password: 'Password', passwordPlaceholder: 'At least 8 characters',
    loginButton: 'Enter demo', registerButton: 'Create demo account', noAccount: 'New to SaiThwet?', hasAccount: 'Already have an account?', close: 'Close',
    notice: 'Demo only. No account is created, and passwords are not verified or stored. Please do not use a real password.',
  },
} as const

export default function AuthDialog({ mode, onClose, onModeChange, onComplete }: Props) {
  const { language } = useLanguage()
  const text = copy[language]
  const titleId = useId()
  const noticeId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Keep keyboard focus inside the modal and return it to the original trigger.
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'))
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', handleKeyDown); previousFocus?.focus() }
  }, [onClose])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // This is only UI state: no credentials are submitted, authenticated or stored.
    onComplete(mode === 'register' ? name.trim() : email.trim())
  }

  return <div className="auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="auth-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={noticeId}>
      <button className="auth-close" type="button" aria-label={text.close} onClick={onClose}>×</button>
      <div className="auth-brand"><img className="auth-brand-mark saithwet-logo-mark" src="/saithwet-soft-blue-icon.svg" alt=""/><span>SaiThwet<small>ဆိုင်သွက်</small></span></div>
      <div className="auth-heading"><span className="auth-eyebrow">SAITHWET WORKSPACE</span><h2 id={titleId}>{text[mode]}</h2><p>{mode === 'login' ? text.loginSubtitle : text.registerSubtitle}</p></div>
      <div className="auth-tabs" role="group" aria-label="Login or register"><button type="button" className={mode === 'login' ? 'active' : ''} aria-pressed={mode === 'login'} onClick={() => onModeChange('login')}>{text.loginTab}</button><button type="button" className={mode === 'register' ? 'active' : ''} aria-pressed={mode === 'register'} onClick={() => onModeChange('register')}>{text.registerTab}</button></div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' && <label>{text.name}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={text.namePlaceholder} autoComplete="name" required maxLength={80}/></label>}
        <label>{text.email}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required maxLength={254}/></label>
        <label>{text.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={text.passwordPlaceholder} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={8} required/></label>
        <button className="auth-submit" type="submit">{mode === 'login' ? text.loginButton : text.registerButton}</button>
      </form>
      <p className="auth-switch">{mode === 'login' ? text.noAccount : text.hasAccount} <button type="button" onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? text.registerTab : text.loginTab}</button></p>
      <p className="auth-notice" id={noticeId}><span aria-hidden="true">i</span>{text.notice}</p>
    </div>
  </div>
}
