import { useState, type FormEvent } from 'react'
import type { Product } from './WorkspaceSections'
import type { PendingDraft, Sale, SaleResult } from './demoFlow'

type Props = { name: string; channel: string; my: boolean; products: Product[]; initialDraft?: PendingDraft; onConsumeDraft: () => void; onRecordSale: (sale: Sale) => SaleResult }
export default function InboxCustomerPanel({ name, channel, my, products, initialDraft, onConsumeDraft, onRecordSale }: Props) {
  const [productId, setProductId] = useState(initialDraft?.productId ?? '')
  const [quantity, setQuantity] = useState(initialDraft?.draft.quantity ?? '1')
  const [unitPrice, setUnitPrice] = useState(initialDraft?.draft.price ?? '')
  const [delivery, setDelivery] = useState(initialDraft?.draft.delivery ?? '0')
  const [method, setMethod] = useState('Cash')
  const [paid, setPaid] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const txt = (en: string, mm: string) => my ? mm : en
  const product = products.find(item => item.id === productId)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const count = Number(quantity)
    if (!product || !Number.isSafeInteger(count) || count < 1 || count > product.stock) {
      setError(true); setMessage(txt('Choose an available product and quantity within the stock limit.','ပစ္စည်းရွေးပြီး လက်ကျန်ထက်မပိုသော အရေအတွက် ထည့်ပါ။')); return
    }
    const price = Number(unitPrice), fee = Number(delivery || '0')
    if (!unitPrice.trim() || !Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(fee) || fee < 0) {
      setError(true); setMessage(txt('Enter valid non-negative prices.','ဈေးနှုန်းနှင့် ပို့ခကို မှန်ကန်စွာ ထည့်ပါ။')); return
    }
    const details=initialDraft?.draft
    const result = onRecordSale({ customer: name, channel, productId: product.id, quantity: count, method, paid, unitPrice: price, delivery: fee, color: initialDraft?.productId === product.id ? details?.color : undefined, size: initialDraft?.productId === product.id ? details?.size : undefined, location: details?.location, phone: details?.phone })
    if (!result.ok) {
      setError(true); setMessage(result.reason === 'stock' ? txt('Stock is no longer sufficient. Please review the quantity.','ပစ္စည်းလက်ကျန် မလုံလောက်တော့ပါ။ အရေအတွက် ပြန်စစ်ပါ။') : result.reason === 'invalid' ? txt('Check the price and delivery fee.','ဈေးနှုန်းနှင့် ပို့ခကို ပြန်စစ်ပါ။') : txt('Could not save in this browser. No order or stock change was made.','Browser တွင် မသိမ်းနိုင်ပါ။ အော်ဒါနှင့် လက်ကျန်ကို မပြောင်းလဲထားပါ။')); return
    }
    setError(false); setMessage(txt(`Order #${result.id} recorded. Stock has been updated.`,`အော်ဒါ #${result.id} သိမ်းပြီး လက်ကျန် လျှော့ပြီးပါပြီ။`))
    setProductId(''); setQuantity('1'); setUnitPrice(''); setDelivery('0'); setMethod('Cash'); setPaid(false); onConsumeDraft()
  }
  return <aside className="inbox-profile inbox-sale-profile">
    <div className="inbox-sale-heading"><span className="inbox-sale-heading-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg></span><div><span className="inbox-sale-eyebrow">ORDER DETAILS</span><h4>{txt('Record a sale','အရောင်းမှတ်တမ်းတင်ရန်')}</h4></div></div>
    <p className="inbox-sale-help">{txt('Select what this customer bought.','ဝယ်ယူသွားသော ပစ္စည်းကို ရွေးပါ။')}</p>
    {initialDraft && <p className="inbox-draft-note" role="status">{initialDraft.productId ? txt('Sample draft ready for your review.','နမူနာ draft ကို စစ်ဆေးရန် ဖြည့်ထားပါသည်။') : txt('Product not found. Select a product before confirming.','ပစ္စည်းမတွေ့ပါ။ အတည်မပြုမီ ပစ္စည်းရွေးပါ။')}</p>}
    {initialDraft && <div className="inbox-draft-details">{(initialDraft.productId === productId && (initialDraft.draft.color || initialDraft.draft.size)) && <span>{[initialDraft.draft.color,initialDraft.draft.size].filter(Boolean).join(' · ')}</span>}{initialDraft.draft.location && <span>{txt('Delivery','ပို့ရန်')}: {initialDraft.draft.location}</span>}{initialDraft.draft.phone && <span>{txt('Phone','ဖုန်း')}: {initialDraft.draft.phone}</span>}</div>}
    <form className="inbox-sale-form" onSubmit={submit}>
      <label>{txt('Product','ပစ္စည်း')}<select value={productId} required onChange={e=>{setProductId(e.target.value);setUnitPrice(String(products.find(item=>item.id===e.target.value)?.price ?? ''));setMessage('')}}><option value="">{txt('Select product','ပစ္စည်းရွေးပါ')}</option>{products.map(item=><option key={item.id} value={item.id} disabled={item.stock<1}>{item.name} · {item.stock} {txt('left','ခုကျန်')}</option>)}</select></label>
      <label>{txt('Quantity','အရေအတွက်')}<input type="number" min="1" step="1" max={product?.stock} required value={quantity} onChange={e=>{setQuantity(e.target.value);setMessage('')}}/></label>
      <label>{txt('Payment method','ငွေပေးချေမှုနည်းလမ်း')}<select value={method} onChange={e=>setMethod(e.target.value)}><option>Cash</option><option>COD</option><option>Bank transfer</option><option>KPay</option><option>Wave</option></select></label>
      <label>{txt('Payment status','ငွေပေးချေမှုအခြေအနေ')}<select value={paid?'verified':'pending'} onChange={e=>setPaid(e.target.value==='verified')}><option value="pending">{txt('Pending','မစစ်ဆေးရသေး')}</option><option value="verified">{txt('Manually verified','ကိုယ်တိုင်စစ်ဆေးပြီး')}</option></select></label>
      <div className="inbox-sale-total"><span>{txt('Total','စုစုပေါင်း')}</span><strong>{(product && Number.isSafeInteger(Number(quantity)) && Number(quantity)>0 ? Number(unitPrice || 0) * Number(quantity) + Number(delivery || 0) : 0).toLocaleString('en-US')} MMK</strong></div>
      {product && Number(delivery)>0 && <p className="inbox-sale-help">{txt(`Includes ${Number(delivery).toLocaleString('en-US')} MMK delivery from the draft.`,`Draft မှ ပို့ခ ${Number(delivery).toLocaleString('en-US')} MMK ပါဝင်သည်။`)}</p>}
      <button type="submit" disabled={!product || product.stock<1}>{txt('Record order','အော်ဒါမှတ်တမ်းတင်မည်')}</button>
      <p className="inbox-sale-help">{txt('Stock decreases when recorded. Payment status is set manually.','မှတ်တမ်းတင်လျှင် လက်ကျန်လျော့မည်။ ငွေပေးချေမှုကို ကိုယ်တိုင်စစ်ဆေးပါ။')}</p>
      {message && <p className={`inbox-sale-feedback ${error?'error':''}`} role={error?'alert':'status'}>{message}</p>}
    </form>
  </aside>
}
