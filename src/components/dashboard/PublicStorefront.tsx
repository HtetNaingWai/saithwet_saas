import { useMemo, useState, type FormEvent } from 'react'
import type { Sale, SaleResult } from './demoFlow'
import type { Product, ShopSettings } from './WorkspaceSections'
import ContentIcon from './ContentIcon'
import '../../styles/public-storefront.css'

type Props = {
  products: Product[]
  settings: ShopSettings
  my: boolean
  onOrder: (sale: Sale) => SaleResult
}

const sampleImages: Record<string, string> = {
  'sample-p1': '/inbox-products/tshirt.png',
  'sample-p2': '/inbox-products/cardigan.png',
  'sample-p3': '/inbox-products/jeans.png',
  'sample-p4': '/inbox-products/bag.svg',
}

export default function PublicStorefront({ products, settings, my, onOrder }: Props) {
  const t = (en: string, mm: string) => my ? mm : en
  const storeUrl = `${window.location.origin}/store?shop=${encodeURIComponent(settings.shop?.trim() || 'your-shop')}`
  const [selected, setSelected] = useState<Product | null>(null)
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [method, setMethod] = useState('Cash')
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  const available = useMemo(() => products.filter(product => product.stock > 0), [products])
  const openOrder = (product: Product) => {
    setSelected(product); setQuantity('1'); setError(''); setOrderId('')
  }
  const closeOrder = () => { setSelected(null); setError(''); setOrderId('') }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected) return
    const count = Number(quantity)
    const result = onOrder({
      customer: customer.trim(), phone: phone.trim(), location: location.trim(),
      productId: selected.id, quantity: count, unitPrice: selected.price, delivery: 0,
      method, paid: method === 'Cash', channel: 'Public storefront',
    })
    if (!result.ok) {
      setError(result.reason === 'stock'
        ? t('This item is no longer available in that quantity.', 'ဒီပစ္စည်း လက်ကျန်မလုံလောက်တော့ပါ။')
        : t('Could not save the order in this demo.', 'ဒီ demo တွင် အော်ဒါသိမ်း၍မရပါ။'))
      return
    }
    setOrderId(result.id)
    setCustomer(''); setPhone(''); setLocation(''); setQuantity('1')
  }

  return <div className="storefront-page">
    <section className="storefront-hero">
      <div>
        <span className="storefront-kicker"><ContentIcon name="sparkle" /> {t('PUBLIC STOREFRONT', 'အများပြည်သူဆိုင်စာမျက်နှာ')}</span>
        <h1>{settings.shop?.trim() || t('Your shop, ready to share.', 'သင့်ဆိုင်ကို link ဖြင့် မျှဝေရန် အဆင်သင့်ပါပြီ။')}</h1>
        <p>{t('Customers can browse products and place an order without opening your seller workspace.', 'ဝယ်သူများက သင့်လုပ်ငန်းခွင်ထဲ မဝင်ဘဲ ပစ္စည်းကြည့်ပြီး အော်ဒါတင်နိုင်ပါသည်။')}</p>
      </div>
      <div className="storefront-link"><ContentIcon name="share" /><a href={storeUrl}>{window.location.host}/store/{(settings.shop || 'your-shop').toLowerCase().replace(/\s+/g, '-')}</a><button type="button" aria-label={t('Copy store link', 'ဆိုင် link ကူးရန်')} onClick={() => navigator.clipboard?.writeText(storeUrl)}><ContentIcon name="copy" /></button></div>
    </section>

    <section className="storefront-toolbar"><div><span className="storefront-eyebrow">{t('CATALOGUE', 'ပစ္စည်းစာရင်း')}</span><h2>{t('Choose what you would like', 'ကြိုက်နှစ်သက်သော ပစ္စည်းကို ရွေးပါ')}</h2></div><span className="storefront-count">{available.length} {t('items', 'မျိုး')}</span></section>
    {available.length ? <div className="storefront-grid">{available.map(product => <article className="storefront-product" key={product.id}>
      <div className="storefront-product-media">{(product.image ?? sampleImages[product.id]) ? <img src={product.image ?? sampleImages[product.id]} alt={product.name} /> : <ContentIcon name="box" />}</div>
      <div className="storefront-product-body"><div><h3>{product.name}</h3><p>{product.price.toLocaleString('en-US')} MMK</p></div><span className={`storefront-stock ${product.stock <= 5 ? 'low' : ''}`}>{product.stock} {t('left', 'ခုကျန်')}</span></div>
      <button className="storefront-buy" type="button" onClick={() => openOrder(product)}><ContentIcon name="plus" /> {t('ယူမယ်', 'ယူမယ်')}</button>
    </article>)}</div> : <div className="storefront-empty"><ContentIcon name="box" /><h2>{t('No products available yet', 'ပစ္စည်း မရှိသေးပါ')}</h2><p>{t('The shop owner will add products here soon.', 'ဆိုင်ပိုင်ရှင်က ပစ္စည်းများ ထည့်ပေးပါမည်။')}</p></div>}

    {selected && <dialog open className="storefront-dialog" aria-labelledby="storefront-order-title">
      <div className="storefront-dialog-head"><div><span className="storefront-eyebrow">{t('ORDER REQUEST', 'အော်ဒါတောင်းဆိုမှု')}</span><h2 id="storefront-order-title">{selected.name}</h2></div><button type="button" className="storefront-close" onClick={closeOrder} aria-label={t('Close', 'ပိတ်ရန်')}>×</button></div>
      {orderId ? <div className="storefront-success"><span><ContentIcon name="check" /></span><h3>{t('Order sent to the shop', 'အော်ဒါကို ဆိုင်ထံ ပို့ပြီးပါပြီ')}</h3><p>{t(`Order ${orderId} is waiting for the owner to confirm.`, `အော်ဒါ ${orderId} ကို ဆိုင်ပိုင်ရှင် အတည်ပြုရန် စောင့်နေပါသည်။`)}</p><button className="storefront-buy" type="button" onClick={closeOrder}>{t('Done', 'ပြီးပါပြီ')}</button></div> : <form onSubmit={submit} className="storefront-form">
        <label>{t('Your name', 'ဝယ်သူအမည်')}<input required autoFocus value={customer} onChange={event => setCustomer(event.target.value)} placeholder={t('e.g. Aye Aye', 'ဥပမာ - Aye Aye')} /></label>
        <label>{t('Phone number', 'ဖုန်းနံပါတ်')}<input required type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="09..." /></label>
        <div className="storefront-form-row"><label>{t('Quantity', 'အရေအတွက်')}<input required type="number" min="1" max={selected.stock} value={quantity} onChange={event => setQuantity(event.target.value)} /></label><label>{t('Payment', 'ငွေပေးချေမှု')}<select value={method} onChange={event => setMethod(event.target.value)}><option>Cash</option><option>KPay</option><option>Wave</option></select></label></div>
        <label>{t('Delivery location', 'ပို့ဆောင်မည့်နေရာ')}<input value={location} onChange={event => setLocation(event.target.value)} placeholder={t('Township / city', 'မြို့နယ် / မြို့')} /></label>
        <div className="storefront-total"><span>{t('Estimated total', 'ခန့်မှန်းစုစုပေါင်း')}</span><strong>{(selected.price * Math.max(1, Number(quantity) || 1)).toLocaleString('en-US')} MMK</strong></div>
        {error && <p className="storefront-error" role="alert">{error}</p>}
        <button className="storefront-submit" type="submit"><ContentIcon name="send" /> {t('ယူမယ်လို့ အော်ဒါတင်မယ်', 'ယူမယ်လို့ အော်ဒါတင်မယ်')}</button>
      </form>}
    </dialog>}
  </div>
}
