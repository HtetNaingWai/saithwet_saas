import { useEffect, useId, useRef, useState } from 'react'
import type { DemoOrder } from './MessageToOrder'
import type { Product } from './WorkspaceSections'
import '../../styles/topbar-menus.css'

type Props = {
  name: string
  shop: string
  photo?: string
  my: boolean
  orders: DemoOrder[]
  products: Product[]
  onProfile: () => void
  onOrders: () => void
  onProducts: () => void
  onLogout: () => void
}

export default function TopbarMenus({ name, shop, photo, my, orders, products, onProfile, onOrders, onProducts, onLogout }: Props) {
  const [open, setOpen] = useState<'notifications' | 'profile' | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const bell = useRef<HTMLButtonElement>(null)
  const profile = useRef<HTMLButtonElement>(null)
  const notificationsId = useId()
  const profileId = useId()
  const newOrders = orders.filter(order => order.status === 'new').length
  const lowStock = products.filter(product => product.stock <= 5).length
  const count = newOrders + lowStock
  const text = (en: string, mm: string) => my ? mm : en

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(null)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(null)
        ;(open === 'notifications' ? bell : profile).current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  const navigate = (action: () => void) => { setOpen(null); action() }
  return <div className="topbar-menus" ref={container}>
    <div className="topbar-menu-anchor">
      <button ref={bell} type="button" className="topbar-menu-trigger topbar-bell" aria-label={text(`Notifications (${count})`, `အသိပေးချက်များ (${count})`)} aria-expanded={open === 'notifications'} aria-controls={notificationsId} onClick={() => setOpen(open === 'notifications' ? null : 'notifications')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 15 18 15 18 8Z"/><path d="M10 20h4"/></svg>
        {count > 0 && <span className="topbar-notification-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
      </button>
      {open === 'notifications' && <section id={notificationsId} className="topbar-popover topbar-notifications" aria-label={text('Notifications', 'အသိပေးချက်များ')}>
        <div className="topbar-popover-heading"><div><strong>{text('Notifications', 'အသိပေးချက်များ')}</strong><small>{text('Your workspace updates', 'သင့်လုပ်ငန်းခွင် အချက်အလက်များ')}</small></div><span>{count}</span></div>
        <div className="topbar-notification-list">
          {newOrders > 0 && <button type="button" className="topbar-notification-item" onClick={() => navigate(onOrders)}><span className="topbar-notification-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg></span><span><strong>{text('New orders', 'အော်ဒါအသစ်များ')}</strong><small>{my ? `အော်ဒါအသစ် ${newOrders} ခု ရှိပါသည်` : `${newOrders} new ${newOrders === 1 ? 'order' : 'orders'}`}</small></span><span className="topbar-chevron">›</span></button>}
          {lowStock > 0 && <button type="button" className="topbar-notification-item" onClick={() => navigate(onProducts)}><span className="topbar-notification-icon stock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg></span><span><strong>{text('Low stock', 'လက်ကျန်နည်းနေသော ပစ္စည်းများ')}</strong><small>{my ? `ပစ္စည်း ${lowStock} မျိုး လက်ကျန်နည်းနေပါသည်` : `${lowStock} ${lowStock === 1 ? 'product needs' : 'products need'} attention`}</small></span><span className="topbar-chevron">›</span></button>}
          {count === 0 && <p className="topbar-notification-empty">{text('No updates right now.', 'လောလောဆယ် အသိပေးချက် မရှိသေးပါ။')}</p>}
        </div>
      </section>}
    </div>
    <div className="topbar-menu-anchor">
      <button ref={profile} type="button" className="topbar-profile-trigger" aria-label={text(`Account menu for ${name}`, `${name} ၏ အကောင့် မီနူး`)} aria-expanded={open === 'profile'} aria-controls={profileId} onClick={() => setOpen(open === 'profile' ? null : 'profile')}><span className="dash-avatar topbar-profile-avatar" aria-hidden="true">{photo ? <img src={photo} alt=""/> : name.slice(0, 1).toUpperCase()}</span><span className="topbar-profile-name">{name}</span><svg className="topbar-profile-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button>
      {open === 'profile' && <section id={profileId} className="topbar-popover topbar-profile-menu" aria-label={text('Account', 'အကောင့်')}>
        <div className="topbar-account"><span className="dash-avatar topbar-account-avatar">{photo ? <img src={photo} alt=""/> : name.slice(0, 1).toUpperCase()}</span><span><strong>{name}</strong><small>{shop || text('Local workspace', 'ဤ browser ရှိ workspace')}</small></span></div>
        <div className="topbar-account-actions">
          <button type="button" onClick={() => navigate(onProfile)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>{text('Profile', 'Profile')}</button>
          <button type="button" onClick={() => navigate(onLogout)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17v2H5V5h5v2M14 8l4 4-4 4M8 12h10"/></svg>{text('Log out', 'ထွက်ရန်')}</button>
        </div>
      </section>}
    </div>
  </div>
}
