import { useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import PublicStorefront from '../components/dashboard/PublicStorefront'
import type { Product, ShopSettings, Payment } from '../components/dashboard/WorkspaceSections'
import type { DemoOrder } from '../components/dashboard/MessageToOrder'
import type { Sale, SaleResult } from '../components/dashboard/demoFlow'
import '../styles/public-storefront.css'

type Workspace = { orders: DemoOrder[]; products: Product[]; payments: Payment[]; settings: ShopSettings }
const key = 'saithwet-workspace-v2'
const defaults: ShopSettings = { shop: '', owner: '', location: '', yangon: '', mandalay: '', other: '' }
const fallbackProducts: Product[] = [
  { id: 'sample-p1', name: 'Classic Oversized T-Shirt', price: 25000, stock: 25, image: '/inbox-products/tshirt.png' },
  { id: 'sample-p2', name: 'Korean Style Cardigan', price: 38000, stock: 12, image: '/inbox-products/cardigan.png' },
  { id: 'sample-p3', name: 'Wide-Leg Jeans', price: 45000, stock: 8, image: '/inbox-products/jeans.png' },
]
function readWorkspace(): Workspace {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null') as Partial<Workspace> | null
    return { orders: saved?.orders ?? [], products: saved?.products?.length ? saved.products : fallbackProducts, payments: saved?.payments ?? [], settings: saved?.settings ?? defaults }
  } catch { return { orders: [], products: fallbackProducts, payments: [], settings: defaults } }
}

export default function PublicStorefrontPage() {
  const { language } = useLanguage()
  const [workspace, setWorkspace] = useState<Workspace>(readWorkspace)
  const workspaceRef = useRef(workspace)
  const save = (next: Workspace) => {
    try { localStorage.setItem(key, JSON.stringify(next)); workspaceRef.current = next; setWorkspace(next); return true } catch { return false }
  }
  const recordSale = (sale: Sale): SaleResult => {
    const data = workspaceRef.current
    const product = data.products.find(item => item.id === sale.productId)
    if (!product || !Number.isSafeInteger(sale.quantity) || sale.quantity < 1 || sale.quantity > product.stock) return { ok: false, reason: 'stock' }
    const id = `SS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    const amount = sale.unitPrice * sale.quantity + sale.delivery
    const next: Workspace = {
      ...data,
      orders: [{ id, name: sale.customer, item: product.name, total: amount.toLocaleString('en-US'), status: 'new', productId: product.id, quantity: sale.quantity, channel: sale.channel, paymentMethod: sale.method, unitPrice: sale.unitPrice, delivery: sale.delivery, location: sale.location, phone: sale.phone, stockAdjusted: false }, ...data.orders],
      payments: [{ id: crypto.randomUUID(), order: id, amount, method: sale.method, status: sale.paid ? 'verified' : 'pending' }, ...data.payments],
      products: data.products,
    }
    if (!save(next)) return { ok: false, reason: 'storage' }
    const messages = JSON.parse(localStorage.getItem('saithwet-public-messages-v1') || '[]') as unknown[]
    messages.unshift({ id: `public-${id}`, name: sale.customer, channel: 'Messenger', text: `ယူမယ် — ${product.name} ${sale.quantity} ခု (${id})`, image: product.image })
    localStorage.setItem('saithwet-public-messages-v1', JSON.stringify(messages.slice(0, 30)))
    return { ok: true, id }
  }
  return <div className="storefront-public-shell"><header className="storefront-public-header"><a href="/" className="storefront-public-brand"><img src="/saithwet-soft-blue-icon.svg" alt="" /><span>SaiThwet</span></a><span className="storefront-public-badge">{language === 'my' ? 'အများပြည်သူ ဆိုင်စာမျက်နှာ' : 'Public storefront'}</span></header><main className="storefront-public-main"><PublicStorefront products={workspace.products} settings={workspace.settings} my={language === 'my'} onOrder={recordSale} /></main></div>
}
