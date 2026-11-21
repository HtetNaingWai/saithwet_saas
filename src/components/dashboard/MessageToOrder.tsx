import { useState, type FormEvent } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export type DemoOrder = { id: string; name: string; item: string; total: string; status: 'new' | 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' }
type Draft = { name: string; phone: string; item: string; color: string; size: string; quantity: string; location: string; price: string; delivery: string }
const blank: Draft = { name: '', phone: '', item: '', color: '', size: '', quantity: '', location: '', price: '', delivery: '' }
const words = {
  en: { title: 'Message to order', sub: 'Turn a customer message into a draft, then review every detail.', message: 'Customer message', messageHelp: 'Paste a customer message.', example: 'Hello! I would like one blue T-shirt, size M, delivered to Mandalay.', extract: 'Create draft', clear: 'Clear', note: 'Simulated extraction: simple keyword matching, not live AI. Missing details are left blank.', draft: 'Order draft', draftHelp: 'Edit and verify all fields before creating your order.', empty: 'Your draft will appear here after you create it.', customer: 'Customer name', phone: 'Phone', product: 'Product', color: 'Colour', size: 'Size', quantity: 'Quantity', location: 'Delivery location', price: 'Unit price (MMK)', delivery: 'Delivery fee (MMK)', total: 'Total', create: 'Confirm order', discard: 'Discard', hint: 'Required: customer, product, quantity and unit price. Totals do not verify payment.', created: 'Order saved in this browser.', placeholder: 'Not specified', fromMessage: 'Create order from message' },
  my: { title: 'စာမှ အော်ဒါသို့', sub: 'Customer စာမှ draft ဖန်တီးပြီး အချက်အလက်များကို ကိုယ်တိုင်စစ်ဆေးပါ။', message: 'Customer message', messageHelp: 'Customer စာကို ကူးထည့်ပါ။', example: 'မင်္ဂလာပါ။ အပြာရောင် T-shirt Size M တစ်ထည်ယူမယ်။ မန္တလေးကို ပို့ပေးပါ။', extract: 'Draft ဖန်တီးမယ်', clear: 'ရှင်းမယ်', note: 'ဤနေရာသည် စကားလုံးအနည်းငယ်ကိုသာ စစ်ဆေးသည့် simulation ဖြစ်ပြီး live AI မဟုတ်ပါ။ မသိသောအချက်များကို အလွတ်ထားပါမည်။', draft: 'Order draft', draftHelp: 'Order မဖန်တီးမီ အချက်အလက်အားလုံးကို ပြင်ဆင်စစ်ဆေးပါ။', empty: 'Draft ဖန်တီးပြီးလျှင် ဤနေရာတွင် ပေါ်လာပါမည်။', customer: 'ဝယ်သူအမည်', phone: 'ဖုန်းနံပါတ်', product: 'ပစ္စည်း', color: 'အရောင်', size: 'Size', quantity: 'အရေအတွက်', location: 'ပို့ဆောင်မည့်နေရာ', price: 'တစ်ခုဈေး (MMK)', delivery: 'ပို့ခ (MMK)', total: 'စုစုပေါင်း', create: 'Order အတည်ပြုမယ်', discard: 'ဖျက်မယ်', hint: 'ဝယ်သူအမည်၊ ပစ္စည်း၊ အရေအတွက်နှင့် တစ်ခုဈေး လိုအပ်ပါသည်။ ငွေပေးချေမှုကို အတည်မပြုပါ။', created: 'Order ကို ဤ browser တွင် သိမ်းဆည်းပြီးပါပြီ။', placeholder: 'မဖော်ပြထားပါ', fromMessage: 'စာမှ အော်ဒါဖန်တီးမယ်' },
} as const

export default function MessageToOrder({ initialMessage, onCreate }: { initialMessage?: string; onCreate: (draft: Omit<DemoOrder, 'id' | 'status'>) => void }) {
  const { language } = useLanguage()
  const t = words[language]
  const [message, setMessage] = useState(initialMessage ?? '')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [created, setCreated] = useState(false)
  const update = (field: keyof Draft, value: string) => setDraft((current) => current ? { ...current, [field]: value } : current)
  const extract = () => {
    if (!message.trim()) return
    // This deliberately limited demo does not infer prices, identities or unknown fields.
    const product = /t[ -]?shirt|တီရှပ်/i.test(message) ? 'Oversized T-Shirt' : /cardigan/i.test(message) ? 'Korean Cardigan' : /jeans/i.test(message) ? 'Wide-Leg Jeans' : /bag/i.test(message) ? 'Mini Shoulder Bag' : ''
    const color = /အပြာ|blue/i.test(message) ? 'Blue' : /အနက်|black/i.test(message) ? 'Black' : /beige/i.test(message) ? 'Beige' : ''
    const size = message.match(/\b(XS|XL|S|M|L)\b/i)?.[0]?.toUpperCase() ?? ''
    const location = /မန္တလေး|mandalay/i.test(message) ? 'Mandalay' : /ရန်ကုန်|yangon/i.test(message) ? 'Yangon' : ''
    setDraft({ ...blank, item: product, color, size, location }); setCreated(false)
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft || !draft.name.trim() || !draft.item.trim()) return
    const total = Number(draft.quantity) * Number(draft.price) + Number(draft.delivery || 0)
    onCreate({ name: draft.name.trim(), item: draft.item.trim(), total: total.toLocaleString('en-US') })
    setDraft(null); setCreated(true)
  }
  return <div className="extract-layout"><section className="dash-card extract-message"><div className="extract-icon"><span>✦</span></div><h2>{t.message}</h2><p className="extract-help">{t.messageHelp}</p><textarea value={message} onChange={(event) => setMessage(event.target.value)} aria-label={t.message} rows={7}/><div className="extract-actions"><button className="dash-primary" type="button" onClick={extract} disabled={!message.trim()}>✦ &nbsp; {t.extract}</button><button className="dash-secondary" type="button" onClick={() => { setMessage(''); setDraft(null); setCreated(false) }}>{t.clear}</button></div><div className="extract-notice">ⓘ &nbsp; {t.note}</div></section><section className="dash-card extract-draft"><div className="extract-draft-head"><div><span className="dash-overline">ORDER PREVIEW</span><h2>{t.draft}</h2><p className="extract-help">{t.draftHelp}</p></div><span className="dash-sample-badge">LOCAL</span></div>{created && <div className="extract-success" role="status">✓ &nbsp;{t.created}</div>}{draft ? <form onSubmit={submit}><div className="extract-fields">{([{ key: 'name', label: t.customer, required: true }, { key: 'phone', label: t.phone }, { key: 'item', label: t.product, required: true }, { key: 'color', label: t.color }, { key: 'size', label: t.size }, { key: 'location', label: t.location }, { key: 'quantity', label: t.quantity, required: true, number: true }, { key: 'price', label: t.price, required: true, number: true }, { key: 'delivery', label: t.delivery, number: true }] as const).map((field) => <label key={field.key}>{field.label}<input type={'number' in field ? 'number' : 'text'} min={'number' in field ? (field.key === 'quantity' ? 1 : 0) : undefined} step={'number' in field ? 1 : undefined} required={'required' in field && field.required} placeholder={t.placeholder} value={draft[field.key]} onChange={(event) => update(field.key, event.target.value)} /></label>)}</div><div className="extract-total"><span>{t.total}</span><strong>{(Number(draft.quantity || 0) * Number(draft.price || 0) + Number(draft.delivery || 0)).toLocaleString('en-US')} MMK</strong></div><p className="extract-hint">{t.hint}</p><div className="extract-actions"><button className="dash-primary" type="submit">{t.create}</button><button className="dash-secondary" type="button" onClick={() => setDraft(null)}>{t.discard}</button></div></form> : !created && <div className="extract-empty"><span>✧</span><p>{t.empty}</p></div>}</section></div>
}
