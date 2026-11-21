import type { DemoOrder } from './MessageToOrder'
import type { Product } from './WorkspaceSections'
import ContentIcon from './ContentIcon'
import '../../styles/analytics-page.css'

type Props={orders:DemoOrder[];products:Product[];my:boolean;onOrders:()=>void;onProducts:()=>void}
const statuses=[
  {key:'new',en:'New',my:'အသစ်',color:'#7295b2'},
  {key:'pending',en:'Pending',my:'စောင့်ဆိုင်း',color:'#c7a889'},
  {key:'preparing',en:'Preparing',my:'ပြင်ဆင်နေ',color:'#aa97c7'},
  {key:'shipped',en:'Shipped',my:'ပို့ဆောင်နေ',color:'#83aeba'},
  {key:'delivered',en:'Delivered',my:'ပို့ဆောင်ပြီး',color:'#7fa998'},
  {key:'cancelled',en:'Cancelled',my:'ပယ်ဖျက်',color:'#c99b9c'},
] as const
export default function AnalyticsPage({orders,products,my,onOrders,onProducts}:Props){
  const t=(en:string,mm:string)=>my?mm:en
  const delivered=orders.filter(order=>order.status==='delivered').reduce((sum,order)=>sum+(Number(order.total.replaceAll(',',''))||0),0)
  const low=products.filter(product=>product.stock>0&&product.stock<=5)
  const out=products.filter(product=>product.stock<=0)
  const healthy=products.filter(product=>product.stock>5)
  const totalStock=products.reduce((sum,product)=>sum+product.stock,0)
  const counts=statuses.map(status=>({...status,count:orders.filter(order=>order.status===status.key).length}))
  const {segments}=counts.filter(status=>status.count>0).reduce((result,status)=>{
    const end=result.position+status.count/orders.length*100
    return {position:end,segments:[...result.segments,`${status.color} ${result.position}% ${end}%`]}
  },{position:0,segments:[] as string[]})
  const stock=products.slice().sort((a,b)=>a.stock-b.stock).slice(0,4)
  const cards=[
    {label:t('Total orders','အော်ဒါစုစုပေါင်း'),value:String(orders.length),detail:t('All recorded orders','မှတ်တမ်းတင်ထားသော အော်ဒါများ'),icon:'orders'},
    {label:t('Delivered order value','ပို့ဆောင်ပြီး အော်ဒါတန်ဖိုး'),value:`${delivered.toLocaleString('en-US')} MMK`,detail:t('Not a payment total','ငွေလက်ခံရရှိမှု စုစုပေါင်းမဟုတ်ပါ'),icon:'stock'},
    {label:t('Products','ပစ္စည်းများ'),value:String(products.length),detail:t('In your catalogue','စာရင်းရှိ ပစ္စည်းများ'),icon:'box'},
    {label:t('Low stock','လက်ကျန်နည်း'),value:String(low.length+out.length),detail:t('5 units or less','၅ ခုနှင့်အောက်'),icon:'down'},
  ]
  return <div className="analytics-page">
    <div className="analytics-stats">{cards.map(card=><article className="analytics-stat" key={card.label}><div className="analytics-stat-top"><span>{card.label}</span><span className="analytics-stat-icon"><ContentIcon name={card.icon}/></span></div><strong>{card.value}</strong><small>{card.detail}</small></article>)}</div>
    <div className="analytics-grid"><section className="analytics-card analytics-orders"><div className="analytics-card-head"><div><span className="analytics-kicker">ORDER ACTIVITY</span><h2>{t('Order status','အော်ဒါအခြေအနေ')}</h2><p>{t('A breakdown of all recorded orders.','မှတ်တမ်းရှိ အော်ဒါများ၏ လက်ရှိအခြေအနေ။')}</p></div><button type="button" onClick={onOrders}>{t('View orders','အော်ဒါများ')} <span aria-hidden="true">↗</span></button></div><div className="analytics-order-chart"><div className="analytics-donut" style={{background:segments.length?`conic-gradient(${segments.join(', ')})`:'var(--analytics-track)'}} aria-hidden="true"><div><strong>{orders.length}</strong><span>{t('total orders','အော်ဒါစုစုပေါင်း')}</span></div></div><div className="analytics-status-list">{counts.map(status=><div className="analytics-status-row" key={status.key}><div className="analytics-status-label"><span><i style={{background:status.color}}/>{my?status.my:status.en}</span><strong>{status.count}</strong></div><div className="analytics-status-track" aria-hidden="true"><div style={{width:`${orders.length?status.count/orders.length*100:0}%`,background:status.color}}/></div></div>)}</div></div>{orders.length===0&&<p className="analytics-empty">{t('No orders recorded yet.','အော်ဒါမှတ်တမ်း မရှိသေးပါ။')}</p>}</section>
    <section className="analytics-card analytics-inventory"><div className="analytics-card-head"><div><span className="analytics-kicker">INVENTORY</span><h2>{t('Inventory overview','ပစ္စည်းလက်ကျန် အကျဉ်း')}</h2><p>{t('A snapshot of your current stock.','လက်ရှိပစ္စည်းလက်ကျန် အခြေအနေ။')}</p></div><button type="button" onClick={onProducts}>{t('View products','ပစ္စည်းများ')} <span aria-hidden="true">↗</span></button></div><div className="analytics-stock-total"><span className="analytics-stock-icon"><ContentIcon name="box"/></span><div><small>{t('Total units in stock','စုစုပေါင်းလက်ကျန်')}</small><strong>{totalStock.toLocaleString('en-US')} <small>{t('units','ခု')}</small></strong></div></div><div className="analytics-stock-segments" aria-hidden="true">{products.length>0&&<><span style={{width:`${healthy.length/products.length*100}%`}}/><span style={{width:`${low.length/products.length*100}%`}}/><span style={{width:`${out.length/products.length*100}%`}}/></>}</div><div className="analytics-stock-legend"><div><span><i className="healthy"/>{t('Healthy (more than 5)','လက်ကျန်လုံလောက် (၅ ခုအထက်)')}</span><strong>{healthy.length}</strong></div><div><span><i className="low"/>{t('Low stock (1–5)','လက်ကျန်နည်း (၁–၅ ခု)')}</span><strong>{low.length}</strong></div><div><span><i className="out"/>{t('Out of stock','လက်ကျန်ကုန်')}</span><strong>{out.length}</strong></div></div></section></div>
    <section className="analytics-card analytics-stock-list"><div className="analytics-card-head"><div><span className="analytics-kicker">STOCK TO WATCH</span><h2>{t('Products with the lowest stock','လက်ကျန်အနည်းဆုံး ပစ္စည်းများ')}</h2><p>{t('Your products, ordered by available units.','လက်ကျန်အရေအတွက်အလိုက် စီထားပါသည်။')}</p></div><button type="button" onClick={onProducts}>{t('Manage stock','လက်ကျန်စီမံရန်')} <span aria-hidden="true">↗</span></button></div>{stock.length?<div>{stock.map(product=><div className="analytics-product-row" key={product.id}><span className="analytics-product-icon"><ContentIcon name="box"/></span><span className="analytics-product-name"><strong>{product.name}</strong><small>{product.price.toLocaleString('en-US')} MMK</small></span><span className={`analytics-stock-badge ${product.stock<=5?'low':''}`}>{product.stock<=0?t('Out of stock','လက်ကျန်ကုန်'):product.stock<=5?t('Low stock','လက်ကျန်နည်း'):t('In stock','လက်ကျန်ရှိ')}</span><strong className="analytics-product-count">{product.stock} <small>{t('units','ခု')}</small></strong></div>)}</div>:<p className="analytics-empty">{t('No products added yet.','ပစ္စည်း မထည့်ရသေးပါ။')}</p>}</section>
  </div>
}
