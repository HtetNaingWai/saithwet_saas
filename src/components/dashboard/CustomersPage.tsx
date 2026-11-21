import { useState, type FormEvent } from 'react'
import type { DemoOrder } from './MessageToOrder'
import type { Payment } from './WorkspaceSections'
import ContentIcon from './ContentIcon'
import '../../styles/customers.css'

export type CustomerRecord = { displayName: string; phone: string; location: string; deleted?: boolean }
type Props = { my: boolean; orders: DemoOrder[]; payments: Payment[]; records: Record<string, CustomerRecord>; onUpdate: (key: string, record: CustomerRecord) => boolean }

export default function CustomersPage({ my, orders, payments, records, onUpdate }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const t = (en: string, mm: string) => my ? mm : en
  const names = [...new Set(orders.map(order => order.name).filter(Boolean))].filter(key => !records[key]?.deleted)
  const customerOrders = active ? orders.filter(order => order.name === active) : []
  const initial = (key: string) => {
    const found = orders.filter(order => order.name === key)
    return records[key] ?? { displayName: key, phone: found.find(order => order.phone)?.phone ?? '', location: found.find(order => order.location)?.location ?? '' }
  }
  const open = (key: string, edit = false) => {
    const data = initial(key)
    setName(data.displayName); setPhone(data.phone); setLocation(data.location); setError(''); setEditing(edit); setActive(key)
  }
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!active || !name.trim()) return
    if (!onUpdate(active, { displayName: name.trim(), phone: phone.trim(), location: location.trim() })) {
      setError(t('Could not save in this browser.', 'Browser တွင် မသိမ်းနိုင်ပါ။'))
      return
    }
    setEditing(false); setError('')
  }
  const remove = (key: string) => {
    if (!window.confirm(t(`Remove ${initial(key).displayName} from the customer list? Existing orders and payments will be kept.`, `${initial(key).displayName} ကို ဝယ်သူစာရင်းမှ ဖယ်မည်လား။ အော်ဒါနှင့် ငွေပေးချေမှုမှတ်တမ်းများကို ဆက်သိမ်းပါမည်။`))) return
    if (!onUpdate(key, { displayName: '', phone: '', location: '', deleted: true })) setError(t('Could not save in this browser.', 'Browser တွင် မသိမ်းနိုင်ပါ။'))
  }
  const total = (items: DemoOrder[]) => items.reduce((sum, order) => sum + (Number(order.total.replaceAll(',', '')) || 0), 0).toLocaleString('en-US')

  return <div className="workspace-stack wp-page">
    <div className="wp-stats wp-stats-two">
      <article className="wp-stat"><div className="wp-stat-top"><span>{t('Customers', 'ဝယ်သူများ')}</span><span className="wp-stat-icon"><ContentIcon name="users" /></span></div><strong>{names.length}</strong><small>{t('From recorded orders', 'အော်ဒါမှတ်တမ်းများမှ')}</small></article>
      <article className="wp-stat"><div className="wp-stat-top"><span>{t('Recorded orders', 'မှတ်တမ်းရှိ အော်ဒါများ')}</span><span className="wp-stat-icon"><ContentIcon name="orders" /></span></div><strong>{orders.length}</strong><small>{t('Across all customers', 'ဝယ်သူအားလုံး၏ အော်ဒါ')}</small></article>
    </div>

    <section className="dash-card wp-card">
      <div className="wp-card-head"><div><h2>{t('Customer list', 'ဝယ်သူစာရင်း')}</h2><p>{t('View and manage customer details from your orders.', 'အော်ဒါများမှ ဝယ်သူအချက်အလက်များကို ကြည့်ရှု၊ ပြင်ဆင်ပါ။')}</p></div><span className="wp-count">{names.length}</span></div>
      {error && !active && <p className="customer-error" role="alert">{error}</p>}
      {names.length ? <div className="wp-entity-list wp-customer-list">
        {names.map(key => {
          const data = initial(key)
          const items = orders.filter(order => order.name === key)
          return <article className="wp-entity-row" key={key}>
            <div className="wp-entity-main"><span className="wp-person"><span aria-hidden="true">{data.displayName.slice(0, 1).toUpperCase()}</span></span><div><strong>{data.displayName}</strong><small>{data.location || t('Customer from recorded order', 'အော်ဒါမှတ်တမ်းမှ ဝယ်သူ')}</small></div></div>
            <div className="wp-entity-data"><span>{t('Orders', 'အော်ဒါ')}</span><strong>{items.length}</strong></div>
            <div className="wp-entity-data money"><span>{t('Order value', 'အော်ဒါတန်ဖိုး')}</span><strong>{total(items)} MMK</strong></div>
            <div className="wp-row-actions" aria-label={`${data.displayName} ${t('actions', 'လုပ်ဆောင်ချက်')}`}>
              <button type="button" className="wp-row-action view" title={t('View customer', 'ဝယ်သူအချက်အလက် ကြည့်ရန်')} aria-label={`${t('View', 'ကြည့်ရန်')} ${data.displayName}`} onClick={() => open(key)}><ContentIcon name="eye" /></button>
              <button type="button" className="wp-row-action edit" title={t('Edit customer', 'ဝယ်သူအချက်အလက် ပြင်ရန်')} aria-label={`${t('Edit', 'ပြင်ရန်')} ${data.displayName}`} onClick={() => open(key, true)}><ContentIcon name="pencil" /></button>
              <button type="button" className="wp-row-action delete" title={t('Delete customer', 'ဝယ်သူ ဖျက်ရန်')} aria-label={`${t('Delete', 'ဖျက်ရန်')} ${data.displayName}`} onClick={() => remove(key)}><ContentIcon name="trash" /></button>
            </div>
          </article>
        })}
      </div> : <div className="workspace-empty"><p>{t('Customers appear when you create orders.', 'အော်ဒါဖန်တီးပြီးလျှင် ဝယ်သူစာရင်း ပေါ်လာပါမည်။')}</p></div>}
    </section>

    {active && <dialog ref={node => { if (node && !node.open) node.showModal() }} className="customer-dialog" aria-labelledby="customer-title" onCancel={event => { event.preventDefault(); setActive(null) }}>
      <div className="customer-dialog-head"><div><span className="account-kicker">CUSTOMER</span><h2 id="customer-title">{editing ? t('Edit customer', 'ဝယ်သူအချက်အလက် ပြင်ရန်') : name}</h2></div><button type="button" className="wp-dialog-close" aria-label={t('Close', 'ပိတ်ရန်')} onClick={() => setActive(null)}>×</button></div>
      {editing ? <form className="customer-form" onSubmit={save}>
        <label>{t('Display name', 'ဝယ်သူအမည်')}<input autoFocus required maxLength={100} value={name} onChange={event => setName(event.target.value)} /></label>
        <label>{t('Phone', 'ဖုန်းနံပါတ်')}<input type="tel" maxLength={40} value={phone} onChange={event => setPhone(event.target.value)} /></label>
        <label>{t('Location', 'လိပ်စာ / မြို့')}<input maxLength={200} value={location} onChange={event => setLocation(event.target.value)} /></label>
        {error && <p className="customer-error" role="alert">{error}</p>}
        <div className="customer-dialog-actions"><button type="button" onClick={() => { if (active) { const data = initial(active); setName(data.displayName); setPhone(data.phone); setLocation(data.location) } setError(''); setEditing(false) }}>{t('Cancel', 'မလုပ်တော့ပါ')}</button><button type="submit" className="customer-primary">{t('Save changes', 'သိမ်းမည်')}</button></div>
      </form> : <>
        <div className="customer-details"><div><span>{t('Phone', 'ဖုန်းနံပါတ်')}</span><strong>{phone || t('Not provided', 'မဖော်ပြထားပါ')}</strong></div><div><span>{t('Location', 'လိပ်စာ / မြို့')}</span><strong>{location || t('Not provided', 'မဖော်ပြထားပါ')}</strong></div><div><span>{t('Orders', 'အော်ဒါများ')}</span><strong>{customerOrders.length}</strong></div><div><span>{t('Recorded order value', 'အော်ဒါတန်ဖိုး')}</span><strong>{total(customerOrders)} MMK</strong></div></div>
        <h3>{t('Recent orders', 'အော်ဒါမှတ်တမ်း')}</h3>
        <div className="customer-order-list">{customerOrders.map(order => <div key={order.id}><span><strong>#{order.id}</strong><small>{order.item}{order.quantity ? ` × ${order.quantity}` : ''}</small></span><span>{order.total} MMK<small>{payments.find(payment => payment.order.replace(/^#/, '') === order.id.replace(/^#/, ''))?.method || order.paymentMethod || t('Payment not recorded', 'ငွေပေးချေမှု မဖော်ပြထား')}</small></span></div>)}</div>
        <p className="customer-note">{t('Customers are grouped by their recorded name. Editing the display name does not change past orders.', 'အော်ဒါတွင် မှတ်တမ်းတင်ထားသော အမည်အလိုက် စုထားသည်။ ပြသမည့်အမည်ပြင်ခြင်းက အော်ဒါဟောင်းများကို မပြောင်းပါ။')}</p>
        <div className="customer-dialog-actions"><button type="button" className="customer-primary" onClick={() => setEditing(true)}>{t('Edit details', 'ပြင်ဆင်ရန်')}</button></div>
      </>}
    </dialog>}
  </div>
}
