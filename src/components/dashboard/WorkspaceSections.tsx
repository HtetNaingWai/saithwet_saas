import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { DemoOrder } from './MessageToOrder'
import ContentIcon from './ContentIcon'
import DemoAssistant from './DemoAssistant'
import '../../styles/workspace-premium.css'

export type Product = { id: string; name: string; stock: number; price: number; image?: string }
export type Payment = { id: string; order: string; amount: number; method: string; status: 'pending' | 'verified' }
export type ShopSettings = { shop: string; owner: string; location: string; yangon: string; mandalay: string; other: string; displayName?: string; photo?: string }
type Props = { view: string; my: boolean; orders: DemoOrder[]; setOrders: (value: DemoOrder[]) => void; products: Product[]; setProducts: (value: Product[]) => boolean; payments: Payment[]; setPayments: (value: Payment[]) => void; settings: ShopSettings }
const money = (n: number) => `${n.toLocaleString('en-US')} MMK`
const sampleImages: Record<string, string> = { 'sample-p1': '/inbox-products/tshirt.png', 'sample-p2': '/inbox-products/cardigan.png', 'sample-p3': '/inbox-products/jeans.png', 'sample-p4': '/inbox-products/bag.svg' }

export default function WorkspaceSections({ view, my, orders, setOrders, products, setProducts, payments, setPayments }: Props) {
  const [query, setQuery] = useState('')
  const productDialog = useRef<HTMLDialogElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [productName, setProductName] = useState('')
  const [productImage, setProductImage] = useState('')
  const [imageError, setImageError] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const imageRequest = useRef(0)
  const fileInput = useRef<HTMLInputElement>(null)
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const txt = (en: string, mm: string) => my ? mm : en
  const openProduct = (product?: Product) => {
    imageRequest.current++; setImageLoading(false); setImageError('')
    setEditingId(product?.id ?? null); setProductName(product?.name ?? '')
    setPrice(product ? String(product.price) : ''); setStock(product ? String(product.stock) : '')
    setProductImage(product ? (product.image ?? sampleImages[product.id] ?? '') : '')
    if (fileInput.current) fileInput.current.value = ''
    productDialog.current?.showModal()
  }
  const addProduct = (event: FormEvent) => {
    event.preventDefault()
    if (!productName.trim() || imageLoading) return
    const product = { id: editingId ?? crypto.randomUUID(), name: productName.trim(), price: Number(price), stock: Number(stock), image: productImage }
    const next = editingId ? products.map(row => row.id === editingId ? { ...row, ...product } : row) : [...products, product]
    if (!setProducts(next)) { setImageError(txt('Not enough browser storage. Remove some local data and try again.', 'Browser ထဲတွင် နေရာမလုံလောက်ပါ။ သိမ်းထားသော data အချို့ကို ဖယ်ပြီး ထပ်ကြိုးစားပါ။')); return }
    setProductName(''); setPrice(''); setStock(''); setProductImage(''); setImageError('')
    if (fileInput.current) fileInput.current.value = ''
    productDialog.current?.close()
  }
  const selectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const request = ++imageRequest.current
    setImageError(''); setProductImage('')
    if (!file) { setImageLoading(false); return }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setImageError(txt('Choose a JPG, PNG or WebP image up to 5 MB.', 'JPG၊ PNG သို့မဟုတ် WebP ပုံ 5 MB အောက် ရွေးပါ။'))
      event.target.value = ''; setImageLoading(false); return
    }
    setImageLoading(true)
    try {
      const bitmap = await createImageBitmap(file)
      const scale = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      if (!context) { bitmap.close(); throw new Error('Canvas unavailable') }
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close()
      if (request === imageRequest.current) setProductImage(canvas.toDataURL('image/jpeg', 0.8))
    } catch {
      if (request === imageRequest.current) setImageError(txt('Could not read this image. Please choose another.', 'ပုံကို ဖတ်၍မရပါ။ အခြားပုံတစ်ပုံ ရွေးပါ။'))
    } finally { if (request === imageRequest.current) setImageLoading(false) }
  }
  const lowStock = products.filter(p => p.stock <= 5).length
  const verified = payments.filter(p => p.status === 'verified')
  const statuses: DemoOrder['status'][] = ['new', 'pending', 'preparing', 'shipped', 'delivered', 'cancelled']
  const labels: Record<DemoOrder['status'], [string, string]> = { new: ['New','အသစ်'], pending: ['Pending','စောင့်ဆိုင်း'], preparing: ['Preparing','ပြင်ဆင်နေ'], shipped: ['Shipped','ပို့ဆောင်နေ'], delivered: ['Delivered','ပို့ဆောင်ပြီး'], cancelled: ['Cancelled','ပယ်ဖျက်'] }
  const changeOrderStatus = (order: DemoOrder, status: DemoOrder['status']) => {
    const shouldAdjust = order.channel === 'Public storefront' && !order.stockAdjusted && status !== 'new' && !!order.productId
    if (shouldAdjust) {
      const product = products.find(item => item.id === order.productId)
      const quantity = order.quantity ?? 1
      if (!product || product.stock < quantity) return
      if (!setProducts(products.map(item => item.id === product.id ? { ...item, stock: item.stock - quantity } : item))) return
    }
    setOrders(orders.map(row => row.id === order.id ? { ...row, status, stockAdjusted: shouldAdjust ? true : row.stockAdjusted } : row))
  }
  const cardHead = (title: string, description: string, badge?: string) => <div className="wp-card-head"><div><h2>{title}</h2><p>{description}</p></div>{badge && <span className="wp-count">{badge}</span>}</div>
  const stat = (label: string, value: string | number, detail: string, icon: string) => <article className="wp-stat" key={label}><div className="wp-stat-top"><span>{label}</span><span className="wp-stat-icon"><ContentIcon name={icon}/></span></div><strong>{value}</strong><small>{detail}</small></article>

  if (view === 'orders') {
    const filtered = orders.filter(o => `${o.id} ${o.name} ${o.item}`.toLowerCase().includes(query.toLowerCase()))
    return <div className="workspace-stack wp-page"><div className="wp-stats wp-order-statuses">{statuses.map(status=>stat(my?labels[status][1]:labels[status][0],orders.filter(order=>order.status===status).length,txt('Orders','အော်ဒါများ'),status==='delivered'?'✓':status==='cancelled'?'↓':status==='shipped'?'↗':status==='preparing'?'◇':status==='pending'?'◷':'▤'))}</div><section className="dash-card wp-card">{cardHead(txt('Order list','အော်ဒါစာရင်း'), txt('Search and update your recorded orders.','သိမ်းထားသော အော်ဒါများကို ရှာဖွေပြီး အခြေအနေပြောင်းနိုင်ပါသည်။'), `${orders.length}`)}<div className="workspace-toolbar"><input className="workspace-input" aria-label={txt('Search orders or customers','အော်ဒါ၊ ဝယ်သူ ရှာရန်')} placeholder={txt('Search orders or customers','အော်ဒါ၊ ဝယ်သူ ရှာရန်')} value={query} onChange={e => setQuery(e.target.value)}/></div>{filtered.length ? <div className="dash-table-wrap"><table className="dash-table"><thead><tr>{[txt('Order','အော်ဒါ'),txt('Customer','ဝယ်သူ'),txt('Product','ပစ္စည်း'),txt('Total','စုစုပေါင်း'),txt('Status','အခြေအနေ')].map(v => <th key={v}>{v}</th>)}</tr></thead><tbody>{filtered.map(o => <tr key={o.id}><td><strong>#{o.id}</strong></td><td>{o.name}</td><td>{o.item}</td><td>{o.total} MMK</td><td><select aria-label={`${o.id} ${txt('status','အခြေအနေ')}`} className="workspace-select" value={o.status} onChange={e => changeOrderStatus(o, e.target.value as DemoOrder['status'])}>{statuses.map(v => <option key={v} value={v}>{my ? labels[v][1] : labels[v][0]}</option>)}</select></td></tr>)}</tbody></table></div> : <Empty my={my} text={orders.length ? 'No matching orders.' : 'No orders yet. Create an order from a message to get started.'} mm={orders.length ? 'ကိုက်ညီသော အော်ဒါမရှိပါ။' : 'အော်ဒါ မရှိသေးပါ။ စာမှ အော်ဒါ ဖန်တီးနိုင်ပါသည်။'}/>}</section></div>
  }
  if (view === 'products') return <div className="workspace-stack wp-page"><div className="wp-stats wp-stats-three">{stat(txt('Products','ပစ္စည်းအမျိုးအစား'), products.length, txt('In your catalogue','စာရင်းရှိ ပစ္စည်းများ'), '◇')}{stat(txt('Total stock','စုစုပေါင်းလက်ကျန်'), products.reduce((n,p)=>n+p.stock,0), txt('Units available','လက်ကျန်အရေအတွက်'), '▤')}{stat(txt('Low stock','လက်ကျန်နည်း'), lowStock, txt('5 units or less','၅ ခုနှင့်အောက်'), '↓')}</div><dialog ref={productDialog} className="wp-product-dialog" aria-labelledby="product-dialog-title"><form className="workspace-form wp-product-form" onSubmit={addProduct}><div className="wp-dialog-header"><div><h2 id="product-dialog-title">{editingId ? txt('Edit product','ပစ္စည်းပြင်ဆင်ရန်') : txt('Add a product','ပစ္စည်းအသစ်ထည့်ရန်')}</h2><p>{editingId ? txt('Update your product details.','ပစ္စည်းအချက်အလက်များကို ပြင်ဆင်ပါ။') : txt('Add an item to your catalogue.','ပစ္စည်းအသေးစိတ်ကို ဖြည့်ပြီး စာရင်းသွင်းပါ။')}</p></div><button className="wp-dialog-close" type="button" aria-label={txt('Close','ပိတ်ရန်')} onClick={()=>productDialog.current?.close()}>×</button></div><div className="wp-image-field"><span className="wp-image-label">{txt('Product photo','ပစ္စည်းပုံ')}</span><div className="wp-image-upload"><span className="wp-image-preview">{productImage ? <img src={productImage} alt={txt('Selected product preview','ရွေးထားသော ပစ္စည်းပုံ')}/> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 3-4 5 6"/></svg>}</span><div><label className="wp-upload-button" htmlFor="product-image">{productImage ? txt('Change photo','ပုံပြောင်းမည်') : txt('Choose photo','ပုံရွေးမည်')}</label><input ref={fileInput} id="product-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage}/>{(productImage || imageError) && <button className="wp-remove-image" type="button" onClick={()=>{imageRequest.current++;setImageLoading(false);setProductImage('');setImageError('');if(fileInput.current) fileInput.current.value=''}}>{txt('Remove','ဖယ်မည်')}</button>}<small>{imageLoading ? txt('Preparing image…','ပုံပြင်ဆင်နေသည်…') : txt('Optional · JPG, PNG or WebP · up to 5 MB','မထည့်လည်းရသည် · JPG, PNG, WebP · 5 MB အထိ')}</small></div></div>{imageError && <p className="wp-image-error" role="alert">{imageError}</p>}</div><div className="workspace-form-grid"><label>{txt('Product name','ပစ္စည်းအမည်')}<input required autoFocus placeholder={txt('e.g. Cotton T-shirt','ဥပမာ - Cotton T-shirt')} className="workspace-input" value={productName} onChange={e=>setProductName(e.target.value)}/></label><label>{txt('Price (MMK)','ဈေးနှုန်း (MMK)')}<input required type="number" min="0" step="1" placeholder="0" className="workspace-input" value={price} onChange={e=>setPrice(e.target.value)}/></label><label>{txt('Stock','လက်ကျန်')}<input required type="number" min="0" step="1" placeholder="0" className="workspace-input" value={stock} onChange={e=>setStock(e.target.value)}/></label></div><div className="wp-dialog-actions"><button className="dash-secondary" type="button" onClick={()=>productDialog.current?.close()}>{txt('Cancel','မလုပ်တော့ပါ')}</button><button className="dash-primary" type="submit" disabled={imageLoading || !!imageError}>{editingId ? txt('Save changes','ပြောင်းလဲမှု သိမ်းမည်') : txt('Add product','ပစ္စည်းထည့်ရန်')}</button></div></form></dialog><button className="wp-add-product" type="button" aria-label={txt('Add product','ပစ္စည်းထည့်ရန်')} onClick={()=>openProduct()}><span aria-hidden="true">＋</span><span className="wp-add-product-label">{txt('Add product','ပစ္စည်းထည့်ရန်')}</span></button><section className="dash-card wp-card">{cardHead(txt('Product catalogue','ပစ္စည်းစာရင်း'),txt('Adjust stock directly from the list.','ပစ္စည်းလက်ကျန်ကို စာရင်းမှ တိုက်ရိုက်ပြင်နိုင်ပါသည်။'),`${products.length}`)}{products.length ? <div className="dash-product-list">{products.map(p=><div className="dash-product wp-product" key={p.id}><span className="wp-product-icon" aria-hidden="true">{(p.image ?? sampleImages[p.id]) ? <img src={p.image ?? sampleImages[p.id]} alt=""/> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>}</span><div><strong>{p.name}</strong><small>{money(p.price)}</small></div><div className="wp-product-end">{p.stock<=5 && <span className="wp-badge warning">{txt('Low stock','လက်ကျန်နည်း')}</span>}<label className="workspace-stock">{txt('Stock','လက်ကျန်')} <input aria-label={`${p.name} ${txt('stock','လက်ကျန်')}`} className="workspace-input" type="number" min="0" step="1" value={p.stock} onChange={e=>setProducts(products.map(row=>row.id===p.id?{...row,stock:Math.max(0,Number(e.target.value))}:row))}/></label><button className="wp-edit-product" type="button" onClick={()=>openProduct(p)} aria-label={`${txt('Edit','ပြင်ဆင်ရန်')} ${p.name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9M16 4a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>{txt('Edit','ပြင်ရန်')}</button><button className="wp-delete-product" type="button" aria-label={`${txt('Delete','ဖျက်ရန်')} ${p.name}`} title={txt('Delete product','ပစ္စည်းဖျက်ရန်')} onClick={()=>{if(window.confirm(my ? `“${p.name}” ကို ဖျက်မည်လား။` : `Delete “${p.name}”?`)) setProducts(products.filter(row=>row.id!==p.id))}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button></div></div>)}</div> : <Empty my={my} text="No products added yet." mm="ပစ္စည်း မထည့်ရသေးပါ။"/>}</section></div>
  if (view === 'payments') return <div className="workspace-stack wp-page"><div className="wp-stats wp-stats-three">{stat(txt('Recorded payments','ငွေပေးချေမှုမှတ်တမ်း'),payments.length,txt('All records','မှတ်တမ်းအားလုံး'),'▣')}{stat(txt('Manually verified','ကိုယ်တိုင်အတည်ပြုပြီး'),money(verified.reduce((n,p)=>n+p.amount,0)),txt('Recorded amount','မှတ်တမ်းတင်ထားသည့်ငွေ'),'✓')}{stat(txt('Awaiting review','စစ်ဆေးရန်ကျန်'),payments.filter(p=>p.status==='pending').length,txt('Payment records','ငွေပေးချေမှုမှတ်တမ်း'),'◷')}</div><section className="dash-card wp-card">{cardHead(txt('Payment history','ငွေပေးချေမှုစာရင်း'),txt('Review and manually verify your records.','မှတ်တမ်းများကို စစ်ဆေးပြီး ကိုယ်တိုင်အတည်ပြုပါ။'),`${payments.length}`)}{payments.length ? <div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>{txt('Order','အော်ဒါ')}</th><th>{txt('Method','နည်းလမ်း')}</th><th>{txt('Amount','ငွေပမာဏ')}</th><th>{txt('Status','အခြေအနေ')}</th><th></th></tr></thead><tbody>{payments.map(p=><tr key={p.id}><td><strong>{p.order}</strong></td><td>{p.method}</td><td>{money(p.amount)}</td><td><span className={`wp-badge ${p.status==='pending'?'warning':'success'}`}>{p.status==='pending'?txt('Pending','စစ်ဆေးရန်'):txt('Verified manually','ကိုယ်တိုင်အတည်ပြုပြီး')}</span></td><td>{p.status === 'pending' && <button className="dash-link" type="button" onClick={()=>setPayments(payments.map(row=>row.id===p.id?{...row,status:'verified'}:row))}>{txt('Mark verified','ကိုယ်တိုင်အတည်ပြုရန်')}</button>}</td></tr>)}</tbody></table></div> : <Empty my={my} text="No payments recorded yet." mm="ငွေပေးချေမှုမှတ်တမ်း မရှိသေးပါ။"/>}</section></div>
  if (view === 'assistant') return <DemoAssistant my={my}/>
  return null
}
function Empty({my,text,mm}:{my:boolean;text:string;mm:string}){return <div className="workspace-empty"><span>○</span><p>{my?mm:text}</p></div>}
