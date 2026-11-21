import type { DemoOrder } from './MessageToOrder'
import type { Product } from './WorkspaceSections'

type Props = { orders: DemoOrder[]; products: Product[]; my: boolean; onViewOrders: () => void; onViewProducts: () => void }
const statuses = [
  { key:'new', en:'New', my:'အသစ်', color:'#718fa5' },
  { key:'pending', en:'Pending', my:'စောင့်ဆိုင်းဆဲ', color:'#b4a392' },
  { key:'preparing', en:'Preparing', my:'ပြင်ဆင်နေဆဲ', color:'#a89cbb' },
  { key:'shipped', en:'Shipped', my:'ပို့ဆောင်နေဆဲ', color:'#8aaeb9' },
  { key:'delivered', en:'Delivered', my:'ပို့ဆောင်ပြီး', color:'#87a99b' },
  { key:'cancelled', en:'Cancelled', my:'ပယ်ဖျက်ပြီး', color:'#c9a1a0' },
] as const

export default function OverviewCharts({orders,products,my,onViewOrders,onViewProducts}:Props) {
  const counts=statuses.map(status=>({...status,count:orders.filter(order=>order.status===status.key).length}))
  const {segments}=counts.filter(status=>status.count>0).reduce((result,status)=>{
    const end=result.position+status.count/orders.length*100
    return {position:end,segments:[...result.segments,`${status.color} ${result.position}% ${end}%`]}
  },{position:0,segments:[] as string[]})
  const chartStyle={background:segments.length ? `conic-gradient(${segments.join(', ')})` : 'var(--overview-track)'}
  const stock=products.slice().sort((a,b)=>a.stock-b.stock).slice(0,5)
  const maxStock=Math.max(1,...stock.map(product=>product.stock))
  const countLabel=my?'စုစုပေါင်း အော်ဒါ':'Total orders'
  return <div className="overview-charts"><section className="overview-card overview-orders-chart"><div className="overview-card-heading"><div><span className="overview-eyebrow">{my?'အော်ဒါအခြေအနေ':'ORDER ACTIVITY'}</span><h2>{my?'အော်ဒါအကျဉ်းချုပ်':'Orders at a glance'}</h2><p>{my?'လက်ရှိ အော်ဒါအခြေအနေအလိုက်':'Orders grouped by their current status'}</p></div><button type="button" onClick={onViewOrders}>{my?'အားလုံးကြည့်ရန်':'View orders'} <span aria-hidden="true">↗</span></button></div><div className="overview-order-content"><div className="overview-donut" style={chartStyle} role="img" aria-label={`${countLabel}: ${orders.length}`}><div className="overview-donut-center"><strong>{orders.length}</strong><span>{countLabel}</span></div></div><div className="overview-legend">{counts.map(status=><div className="overview-legend-item" key={status.key}><span className="overview-legend-dot" style={{background:status.color}}/><span>{my?status.my:status.en}</span><strong>{status.count}</strong></div>)}</div></div></section><section className="overview-card overview-stock-chart"><div className="overview-card-heading"><div><span className="overview-eyebrow">{my?'ပစ္စည်းလက်ကျန်':'INVENTORY'}</span><h2>{my?'လက်ကျန်အခြေအနေ':'Stock overview'}</h2><p>{my?'လက်ကျန်နည်းသည့် ပစ္စည်းများ':'Products with the lowest stock'}</p></div><button type="button" onClick={onViewProducts}>{my?'ပစ္စည်းများ':'View products'} <span aria-hidden="true">↗</span></button></div>{stock.length?<div className="overview-stock-list">{stock.map(product=><div className="overview-stock-row" key={product.id}><div className="overview-stock-label"><span>{product.name}</span><strong>{product.stock} <small>{my?'ခု':'units'}</small></strong></div><div className="overview-stock-track"><div className={product.stock<=5?'overview-stock-fill low':'overview-stock-fill'} style={{width:`${product.stock/maxStock*100}%`}}/></div></div>)}</div>:<div className="overview-chart-empty">{my?'ပစ္စည်း မထည့်ရသေးပါ။':'No products added yet.'}</div>}</section></div>
}
