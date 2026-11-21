import { useEffect, useState, type ReactNode, type SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import MessageToOrder, { type DemoOrder } from '../components/dashboard/MessageToOrder'
import WorkspaceSections, { type Payment, type Product, type ShopSettings } from '../components/dashboard/WorkspaceSections'
import '../styles/dashboard.css'

type View = 'overview' | 'messages' | 'extract' | 'orders' | 'products' | 'payments' | 'customers' | 'assistant' | 'analytics' | 'settings'
type NavItem = { id: View; en: string; my: string; icon: string; group: 'workspace' | 'commerce' | 'insights' | 'account' }
const navigation: NavItem[] = [
  {id:'overview',en:'Overview',my:'အကျဉ်းချုပ်',icon:'grid',group:'workspace'},
  {id:'messages',en:'Message inbox',my:'စာများ',icon:'message',group:'workspace'},
  {id:'extract',en:'Message to order',my:'စာမှ အော်ဒါသို့',icon:'sparkle',group:'workspace'},
  {id:'orders',en:'Orders',my:'အော်ဒါများ',icon:'orders',group:'commerce'},
  {id:'products',en:'Products & inventory',my:'ပစ္စည်းနှင့် လက်ကျန်',icon:'box',group:'commerce'},
  {id:'payments',en:'Payments',my:'ငွေပေးချေမှုများ',icon:'wallet',group:'commerce'},
  {id:'customers',en:'Customers',my:'ဝယ်သူများ',icon:'users',group:'commerce'},
  {id:'assistant',en:'AI business assistant',my:'AI အကူ',icon:'assistant',group:'insights'},
  {id:'analytics',en:'Analytics',my:'စာရင်းအင်းများ',icon:'chart',group:'insights'},
  {id:'settings',en:'Settings',my:'ဆက်တင်များ',icon:'settings',group:'account'},
]
const groups = [
  {id:'workspace',en:'WORKSPACE',my:'လုပ်ငန်းခွင်'}, {id:'commerce',en:'MANAGE',my:'စီမံခန့်ခွဲရန်'},
  {id:'insights',en:'INSIGHTS',my:'သုံးသပ်ချက်များ'}, {id:'account',en:'PREFERENCES',my:'ဆက်တင်များ'},
] as const
const defaultSettings: ShopSettings = {shop:'',owner:'',location:'',yangon:'',mandalay:'',other:''}
function useLocalData<T>(key: string, initial: T): [T, (value: T | ((previous: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initial } catch { return initial } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Local storage can be unavailable. */ } }, [key, value])
  return [value, setValue]
}
function NavIcon({name}:{name:string}) {
  const paths: Record<string, ReactNode> = {
    grid:<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    message:<><path d="M4 5h16v12H9l-5 3V5Z"/><path d="M8 9h8M8 13h5"/></>,sparkle:<><path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
    orders:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,box:<><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/></>,
    wallet:<><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18M16 14h2"/></>,users:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1"/></>,
    assistant:<><rect x="4" y="6" width="16" height="13" rx="4"/><path d="M12 3v3M8 12h.01M16 12h.01M9 16h6"/></>,chart:<><path d="M4 20h16M6 16v-4M12 16V8M18 16V4"/></>,settings:<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l1.5-1.1-1.5-2.6-1.8.6a7 7 0 0 0-2-1.2L14.7 4h-3.1l-.4 2.5a7 7 0 0 0-2 1.2l-1.8-.6-1.5 2.6 1.5 1.1a7 7 0 0 0 0 2.4l-1.5 1.1 1.5 2.6 1.8-.6a7 7 0 0 0 2 1.2l.4 2.5h3.1l.4-2.5a7 7 0 0 0 2-1.2l1.8.6 1.5-2.6-1.5-1.1c.1-.4.1-.8.1-1.2Z"/></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
export default function DashboardPage({user,onExit}:{user:string;onExit:()=>void}) {
  const {language,setLanguage}=useLanguage(); const {theme,toggleTheme}=useTheme(); const my=language==='my'
  const [view,setView]=useState<View>('overview'); const [drawer,setDrawer]=useState(false)
  const [collapsed,setCollapsed]=useState(false)
  const [orders,setOrders]=useLocalData<DemoOrder[]>('saithwet-orders-v1',[])
  const [products,setProducts]=useLocalData<Product[]>('saithwet-products-v1',[])
  const [payments,setPayments]=useLocalData<Payment[]>('saithwet-payments-v1',[])
  const [settings,setSettings]=useLocalData<ShopSettings>('saithwet-settings-v1',defaultSettings)
  const [tip,setTip]=useState<{ label: string; top: number; left: number } | null>(null)
  // Seed a presentation shop only once, and never replace existing workspace records.
  useEffect(() => {
    try {
      if (localStorage.getItem('saithwet-presentation-seeded') || orders.length || products.length || payments.length) return
      localStorage.setItem('saithwet-presentation-seeded', '1')
      setProducts([{id:'sample-p1',name:'Classic Oversized T-Shirt',price:25000,stock:25},{id:'sample-p2',name:'Korean Style Cardigan',price:38000,stock:12},{id:'sample-p3',name:'Wide-Leg Jeans',price:45000,stock:8},{id:'sample-p4',name:'Mini Shoulder Bag',price:32000,stock:3}])
      setOrders([{id:'SS-025',name:'Khin Khin',item:'Classic Oversized T-Shirt',total:'53,000',status:'new'},{id:'SS-024',name:'Hnin Ei',item:'Mini Shoulder Bag',total:'35,000',status:'pending'},{id:'SS-023',name:'Su Su',item:'Wide-Leg Jeans',total:'48,000',status:'preparing'},{id:'SS-022',name:'May Thiri',item:'Korean Style Cardigan',total:'41,000',status:'shipped'},{id:'SS-021',name:'Aye Aye',item:'Classic Oversized T-Shirt',total:'28,000',status:'delivered'}])
      setPayments([{id:'sample-pay1',order:'SS-021',amount:28000,method:'KPay',status:'verified'},{id:'sample-pay2',order:'SS-022',amount:41000,method:'Wave',status:'pending'}])
    } catch { /* The workspace remains usable without browser storage. */ }
  }, [orders.length, products.length, payments.length, setOrders, setProducts, setPayments])
  const showTooltip = (event: SyntheticEvent<HTMLButtonElement>, label: string) => {
    if (!collapsed || window.innerWidth <= 760) return
    const rect = event.currentTarget.getBoundingClientRect()
    setTip({ label, top: Math.max(24, Math.min(window.innerHeight - 24, rect.top + rect.height / 2)), left: rect.right + 12 })
  }
  const txt=(en:string,mm:string)=>my?mm:en
  const current=navigation.find(item=>item.id===view)!
  const firstName=user.includes('@')?user.split('@')[0]:user
  const revenue=orders.filter(o=>o.status==='delivered').reduce((sum,o)=>sum+Number(o.total.replaceAll(',','')),0)
  const show=(value:View)=>{setTip(null);setView(value);setDrawer(false);window.scrollTo({top:0,behavior:'auto'})}
  const sectionProps={view,my,orders,setOrders,products,setProducts,payments,setPayments,settings,setSettings}
  return <div className={`dash-shell ${collapsed ? 'sidebar-collapsed' : ''}`}><aside className={`dash-sidebar ${drawer?'sidebar-open':''}`}><div className="dash-brand"><img className="dash-brand-icon saithwet-logo-mark" src="/saithwet-soft-blue-icon.svg" alt=""/><div className="sidebar-brand-text"><strong>SaiThwet</strong><small>ဆိုင်သွက် · {txt('Seller workspace','အရောင်းလုပ်ငန်းခွင်')}</small></div><button className="sidebar-collapse" type="button" aria-expanded={!collapsed} aria-label={collapsed ? txt('Expand sidebar','Sidebar ဖြန့်ရန်') : txt('Collapse sidebar','Sidebar ခေါက်ရန်')} title={collapsed ? txt('Expand sidebar','Sidebar ဖြန့်ရန်') : txt('Collapse sidebar','Sidebar ခေါက်ရန်')} onClick={()=>{setTip(null);setCollapsed(!collapsed)}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/><path d={collapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'}/></svg></button><button className="sidebar-close" type="button" aria-label={txt('Close menu','မီနူးပိတ်ရန်')} onClick={()=>setDrawer(false)}>×</button></div><nav className="dash-nav" aria-label={txt('Workspace navigation','လုပ်ငန်းခွင် မီနူး')}>{groups.map(group=><div className="nav-group" key={group.id}><p className="dash-nav-label">{my?group.my:group.en}</p>{navigation.filter(item=>item.group===group.id).map(item=><button key={item.id} type="button" className={view===item.id?'active':''} aria-current={view===item.id?'page':undefined} aria-label={my?item.my:item.en} onMouseEnter={event=>showTooltip(event,my?item.my:item.en)} onMouseLeave={()=>setTip(null)} onFocus={event=>showTooltip(event,my?item.my:item.en)} onBlur={()=>setTip(null)} onClick={()=>show(item.id)}><span className={`nav-icon nav-icon-${item.id}`}><NavIcon name={item.icon}/></span><span className="sidebar-item-label">{my?item.my:item.en}</span></button>)}</div>)}</nav><div className="dash-side-bottom"><div className="sidebar-profile"><span className="dash-avatar">{firstName.slice(0,1).toUpperCase()}</span><div className="sidebar-profile-text"><strong>{settings.shop||firstName}</strong><small>{txt('Local workspace','ဤ browser ရှိ workspace')}</small></div></div><button className="dash-exit" type="button" onClick={onExit} aria-label={txt('Exit workspace','ထွက်ရန်')} onMouseEnter={event=>showTooltip(event,txt('Exit workspace','ထွက်ရန်'))} onMouseLeave={()=>setTip(null)} onFocus={event=>showTooltip(event,txt('Exit workspace','ထွက်ရန်'))} onBlur={()=>setTip(null)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17v2H5V5h5v2M14 8l4 4-4 4M8 12h10"/></svg><span className="sidebar-exit-label">{txt('Exit workspace','ထွက်ရန်')}</span></button></div></aside>{tip && createPortal(<span className="sidebar-tooltip" style={{top:tip.top,left:tip.left}} aria-hidden="true">{tip.label}</span>,document.body)}{drawer&&<button className="sidebar-scrim" aria-label={txt('Close menu','မီနူးပိတ်ရန်')} onClick={()=>setDrawer(false)}/>}
  <div className="dash-main"><header className="dash-topbar"><div className="dash-top-left"><button className="dashboard-menu" type="button" onClick={()=>setDrawer(true)} aria-label={txt('Open menu','မီနူးဖွင့်ရန်')} aria-expanded={drawer}>☰</button><span className="dash-breadcrumb">SAITHWET <span>/</span> {my?current.my:current.en}</span></div><div className="dash-top-actions"><button className="dash-icon-button" type="button" aria-label={txt('Change theme','Theme ပြောင်းရန်')} onClick={toggleTheme}>{theme==='light'?'☾':'☼'}</button><div className="dash-languages" role="group" aria-label={txt('Language','ဘာသာစကား')}><button type="button" className={my?'active':''} aria-pressed={my} onClick={()=>setLanguage('my')}>မြန်မာ</button><button type="button" className={!my?'active':''} aria-pressed={!my} onClick={()=>setLanguage('en')}>EN</button></div><div className="dash-avatar" title={firstName}>{firstName.slice(0,1).toUpperCase()}</div></div></header>
  <main className="dash-content">{view==='overview'?<><section className="dash-welcome"><div><span className="dash-overline">✦ &nbsp;{txt('WELCOME','မင်္ဂလာပါ')} {firstName}</span><h1>{txt('Your shop, in a good place.','သင့်ဆိုင်အလုပ်တွေကို စတင်လိုက်ပါ။')}</h1><p>{txt('Illustrative shop data · Your workspace at a glance.','နမူနာဆိုင်အချက်အလက် · သင့်ဆိုင်ရဲ့ အခြေအနေကို ကြည့်ပါ။')}</p></div><button className="dash-primary" onClick={()=>show('extract')}>{txt('Create order','အော်ဒါဖန်တီးရန်')}</button><div className="dash-welcome-decor decor-one"/><div className="dash-welcome-decor decor-two"/></section><section className="dash-stats">{[{label:txt('Delivered order value','ပို့ဆောင်ပြီး အော်ဒါတန်ဖိုး'),value:`${revenue.toLocaleString()} MMK`,icon:'chart',tone:'mint'},{label:txt('Orders','အော်ဒါများ'),value:String(orders.length),icon:'orders',tone:'lilac'},{label:txt('Products','ပစ္စည်းများ'),value:String(products.length),icon:'box',tone:'blue'},{label:txt('Low stock','လက်ကျန်နည်း'),value:String(products.filter(p=>p.stock<=5).length),icon:'box',tone:'peach'}].map(stat=><article className="dash-stat" key={stat.label}><div className="dash-stat-top">{stat.label}<span className={`dash-tile-icon ${stat.tone}`}><NavIcon name={stat.icon}/></span></div><div className="dash-stat-value">{stat.value}</div></article>)}</section><div className="dash-grid"><section className="dash-card"><div className="dash-card-head"><div><h2>{txt('Recent orders','နောက်ဆုံးအော်ဒါများ')}</h2><p>{txt('Your latest recorded orders','သိမ်းထားသော နောက်ဆုံးအော်ဒါများ')}</p></div><button className="dash-link" onClick={()=>show('orders')}>{txt('View all','အားလုံးကြည့်ရန်')}</button></div>{orders.length?<div className="dash-product-list">{orders.slice(0,4).map(o=><div className="dash-product" key={o.id}><span className="dash-product-icon mint"><NavIcon name="orders"/></span><div><strong>{o.name}</strong><small>{o.item} · #{o.id}</small></div><span className="dash-stock">{o.total} MMK</span></div>)}</div>:<div className="workspace-empty"><span>○</span><p>{txt('No orders yet.','အော်ဒါ မရှိသေးပါ။')}</p></div>}</section><section className="dash-card"><div className="dash-card-head"><div><h2>{txt('Inventory snapshot','လက်ကျန်ပစ္စည်းများ')}</h2><p>{txt('Your product catalogue','သင့်ပစ္စည်းစာရင်း')}</p></div><button className="dash-link" onClick={()=>show('products')}>{txt('View all','အားလုံးကြည့်ရန်')}</button></div>{products.length?<div className="dash-product-list">{products.slice(0,4).map(p=><div className="dash-product" key={p.id}><span className="dash-product-icon blue"><NavIcon name="box"/></span><div><strong>{p.name}</strong><small>{p.price.toLocaleString()} MMK</small></div><span className="dash-stock">{p.stock}</span></div>)}</div>:<div className="workspace-empty"><span>◇</span><p>{txt('No products added yet.','ပစ္စည်း မထည့်ရသေးပါ။')}</p></div>}</section></div></>:<><div className="dash-page-title"><div><span className="dash-overline">SAITHWET / {my?current.my:current.en}</span><h1>{my?current.my:current.en}</h1><p>{view==='messages'?txt('Connect a channel to receive and reply to messages.','စာများလက်ခံရန်နှင့် ပြန်ရန် channel ချိတ်ဆက်ပါ။'):view==='extract'?txt('Create an editable order from a customer message.','Customer စာမှ order draft ဖန်တီးပါ။'):txt('Manage your shop in one place.','သင့်ဆိုင်ကို တစ်နေရာတည်းမှာ စီမံပါ။')}</p></div></div>{view==='messages'?<section className="dash-card workspace-disconnected"><span className="workspace-large-icon"><NavIcon name="message"/></span><h2>{txt('No channels connected','Channel ချိတ်ဆက်ထားခြင်း မရှိသေးပါ')}</h2><p>{txt('Messenger and Telegram integrations require a backend and account permissions. Messages cannot be sent or received yet.','Messenger နှင့် Telegram ချိတ်ဆက်ရန် backend နှင့် account ခွင့်ပြုချက် လိုအပ်ပါသည်။ လက်ရှိတွင် စာပို့ခြင်း၊ လက်ခံခြင်း မရသေးပါ။')}</p></section>:view==='extract'?<MessageToOrder onCreate={order=>setOrders(current=>[{...order,id:`SS-${crypto.randomUUID().slice(0,8).toUpperCase()}`,status:'new'},...current])}/>:<WorkspaceSections {...sectionProps}/>}</>}
  <div className="dash-footer"><span>© {new Date().getFullYear()} SaiThwet</span><span>{txt('Stored in this browser','ဤ browser တွင်သာ သိမ်းဆည်းထားသည်')}</span></div></main></div></div>
}
