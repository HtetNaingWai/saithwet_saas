import { useState, type FormEvent } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import ContentIcon from './ContentIcon'

export type DemoOrder = { id: string; name: string; item: string; total: string; status: 'new' | 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'; productId?: string; quantity?: number; channel?: string; paymentMethod?: string; unitPrice?: number; delivery?: number; color?: string; size?: string; location?: string; phone?: string }
export type Draft = { name: string; phone: string; item: string; color: string; size: string; quantity: string; location: string; price: string; delivery: string }
const sample: Draft = { name: 'Aye Aye', phone: '', item: 'Classic Oversized T-Shirt', color: 'Blue', size: 'M', quantity: '1', location: 'Mandalay', price: '25000', delivery: '3000' }
const words = {
  en: { title: 'Message to order', sub: 'Turn a customer message into a draft, then review every detail.', message: 'Customer message', messageHelp: 'Paste a customer message.', example: 'Hello! I would like one blue T-shirt, size M, delivered to Mandalay.', extract: 'Create draft', clear: 'Clear', note: 'Simulated extraction: simple keyword matching, not live AI. Missing details are left blank.', draft: 'Order draft', draftHelp: 'Edit and verify all fields before creating your order.', empty: 'Your draft will appear here after you create it.', customer: 'Customer name', phone: 'Phone', product: 'Product', color: 'Colour', size: 'Size', quantity: 'Quantity', location: 'Delivery location', price: 'Unit price (MMK)', delivery: 'Delivery fee (MMK)', total: 'Total', create: 'Review in inbox', discard: 'Discard', hint: 'Required: customer, product, quantity and unit price. Totals do not verify payment.', created: 'Order saved in this browser.', placeholder: 'Not specified', fromMessage: 'Create order from message' },
  my: { title: 'စာမှ အော်ဒါသို့', sub: 'Customer စာမှ draft ဖန်တီးပြီး အချက်အလက်များကို ကိုယ်တိုင်စစ်ဆေးပါ။', message: 'Customer message', messageHelp: 'Customer စာကို ကူးထည့်ပါ။', example: 'မင်္ဂလာပါ။ အပြာရောင် T-shirt Size M တစ်ထည်ယူမယ်။ မန္တလေးကို ပို့ပေးပါ။', extract: 'Draft ဖန်တီးမယ်', clear: 'ရှင်းမယ်', note: 'ဤနေရာသည် စကားလုံးအနည်းငယ်ကိုသာ စစ်ဆေးသည့် simulation ဖြစ်ပြီး live AI မဟုတ်ပါ။ မသိသောအချက်များကို အလွတ်ထားပါမည်။', draft: 'Order draft', draftHelp: 'Order မဖန်တီးမီ အချက်အလက်အားလုံးကို ပြင်ဆင်စစ်ဆေးပါ။', empty: 'Draft ဖန်တီးပြီးလျှင် ဤနေရာတွင် ပေါ်လာပါမည်။', customer: 'ဝယ်သူအမည်', phone: 'ဖုန်းနံပါတ်', product: 'ပစ္စည်း', color: 'အရောင်', size: 'Size', quantity: 'အရေအတွက်', location: 'ပို့ဆောင်မည့်နေရာ', price: 'တစ်ခုဈေး (MMK)', delivery: 'ပို့ခ (MMK)', total: 'စုစုပေါင်း', create: 'Inbox တွင် စစ်ဆေးမယ်', discard: 'ဖျက်မယ်', hint: 'ဝယ်သူအမည်၊ ပစ္စည်း၊ အရေအတွက်နှင့် တစ်ခုဈေး လိုအပ်ပါသည်။ ငွေပေးချေမှုကို အတည်မပြုပါ။', created: 'Order ကို ဤ browser တွင် သိမ်းဆည်းပြီးပါပြီ။', placeholder: 'မဖော်ပြထားပါ', fromMessage: 'စာမှ အော်ဒါဖန်တီးမယ်' },
} as const

export default function MessageToOrder({ initialMessage, customerName, onCreate }: { initialMessage?: string; customerName?: string; onCreate: (draft: Draft) => string | undefined }) {
  const { language } = useLanguage()
  const t = words[language]
  const [message, setMessage] = useState(initialMessage ?? '')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [created, setCreated] = useState(false)
  const [error, setError] = useState('')
  const update = (field: keyof Draft, value: string) => setDraft((current) => current ? { ...current, [field]: value } : current)
  const extract = () => {
    if (!message.trim()) return
    setCreated(false)
    const examples: Record<string, Partial<Draft>> = {
      'May Thiri': { item: 'Korean Style Cardigan', color: 'Beige', size: '', location: '', price: '38000', delivery: '' },
      'Su Su': { item: 'Wide-Leg Jeans', color: '', size: '28', location: '', price: '45000', delivery: '' },
    }
    setDraft({ ...sample, ...(examples[customerName || ''] || {}), name: customerName || sample.name })
    setError(language === 'my'
      ? 'ဤသည် presentation အတွက် နမူနာ order ဖြစ်ပြီး ထည့်ထားသောစာကို AI ဖြင့် ဖတ်ထားခြင်း မဟုတ်ပါ။ အတည်မပြုမီ ပြင်ဆင်စစ်ဆေးပါ။'
      : 'This is a presentation sample, not an AI extraction of your message. Review and edit it before confirming.')
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft || !draft.name.trim() || !draft.item.trim()) return
    const issue = onCreate(draft)
    if (issue) { setError(issue); return }
    setDraft(null); setCreated(true)
  }
  return <div className="extract-layout"><section className="dash-card extract-message"><div className="extract-icon"><ContentIcon name="sparkle"/></div><h2>{t.message}</h2><p className="extract-help">{t.messageHelp}</p><textarea value={message} onChange={(event) => setMessage(event.target.value)} aria-label={t.message} rows={7} maxLength={4000} placeholder={t.example}/><div className="extract-actions"><button className="dash-primary" type="button" onClick={extract} disabled={!message.trim()}>✦ &nbsp; {t.extract}</button><button className="dash-secondary" type="button" onClick={() => { setMessage(''); setDraft(null); setCreated(false); setError('') }}>{t.clear}</button></div>{error && <div className="extract-notice" role="status">{error}</div>}<div className="extract-notice">ⓘ &nbsp; {language === 'my' ? 'Demo အတွက် ကြိုတင်ပြင်ထားသော နမူနာ draft ကိုသာ ပြသပါမည်။ စာကို AI သို့ မပို့ပါ။' : 'This demo shows a prepared sample draft. Your message is not sent to an AI service.'}</div></section><section className="dash-card extract-draft"><div className="extract-draft-head"><div><span className="dash-overline">ORDER PREVIEW</span><h2>{t.draft}</h2><p className="extract-help">{t.draftHelp}</p></div><span className="dash-sample-badge">{language === 'my' ? 'နမူနာ DRAFT' : 'SAMPLE DRAFT'}</span></div>{created && <div className="extract-success" role="status">✓ &nbsp;{t.created}</div>}{draft ? <form onSubmit={submit}><div className="extract-fields">{([{ key: 'name', label: t.customer, required: true }, { key: 'phone', label: t.phone }, { key: 'item', label: t.product, required: true }, { key: 'color', label: t.color }, { key: 'size', label: t.size }, { key: 'location', label: t.location }, { key: 'quantity', label: t.quantity, required: true, number: true }, { key: 'price', label: t.price, required: true, number: true }, { key: 'delivery', label: t.delivery, number: true }] as const).map((field) => <label key={field.key}>{field.label}<input type={'number' in field ? 'number' : 'text'} min={'number' in field ? (field.key === 'quantity' ? 1 : 0) : undefined} step={'number' in field ? 1 : undefined} required={'required' in field && field.required} placeholder={t.placeholder} value={draft[field.key]} onChange={(event) => update(field.key, event.target.value)} /></label>)}</div><div className="extract-total"><span>{t.total}</span><strong>{(Number(draft.quantity || 0) * Number(draft.price || 0) + Number(draft.delivery || 0)).toLocaleString('en-US')} MMK</strong></div><p className="extract-hint">{t.hint}</p><div className="extract-actions"><button className="dash-primary" type="submit">{t.create}</button><button className="dash-secondary" type="button" onClick={() => setDraft(null)}>{t.discard}</button></div></form> : !created && <div className="extract-empty"><span className="extract-empty-icon"><ContentIcon name="sparkle"/></span><p>{t.empty}</p></div>}</section></div>
}
