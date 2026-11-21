import { useState } from 'react'
import ContentIcon from './ContentIcon'
import '../../styles/demo-assistant.css'

type Example = { id: string; question: string; answer: string }
export default function DemoAssistant({ my }: { my: boolean }) {
  const [selected, setSelected] = useState<string | null>(null)
  const examples: Example[] = my ? [
    { id: 'stock', question: 'ဘယ်ပစ္စည်း လက်ကျန်အနည်းဆုံးလဲ။', answer: 'နမူနာဆိုင်တွင် Mini Shoulder Bag သည် ၃ ခုသာ ကျန်ရှိပါသည်။ ထပ်မံဖြည့်တင်းရန် စဉ်းစားနိုင်ပါသည်။' },
    { id: 'orders', question: 'အော်ဒါအခြေအနေ အကျဉ်းချုပ်ပြပါ။', answer: 'နမူနာအချက်အလက်တွင် အော်ဒါ ၅ ခုရှိပြီး အသစ်၊ စောင့်ဆိုင်း၊ ပြင်ဆင်နေ၊ ပို့ဆောင်နေ၊ ပို့ဆောင်ပြီး အဆင့်တစ်ခုစီတွင် ၁ ခုစီ ရှိပါသည်။' },
    { id: 'sales', question: 'ပို့ဆောင်ပြီး အော်ဒါတန်ဖိုး ဘယ်လောက်လဲ။', answer: 'နမူနာဆိုင်၏ ပို့ဆောင်ပြီး အော်ဒါတန်ဖိုးမှာ 28,000 MMK ဖြစ်ပါသည်။ ဤတန်ဖိုးသည် ငွေဝင်ပြီးကြောင်း အတည်ပြုချက် မဟုတ်ပါ။' },
  ] : [
    { id: 'stock', question: 'Which product has the lowest stock?', answer: 'In the sample shop, Mini Shoulder Bag has 3 units left. Consider restocking it.' },
    { id: 'orders', question: 'Summarise my orders.', answer: 'The sample shop has 5 orders: one each new, pending, preparing, shipped and delivered.' },
    { id: 'sales', question: 'What is the delivered order value?', answer: 'The sample delivered order value is 28,000 MMK. This does not confirm that payment was received.' },
  ]
  const example = examples.find(item => item.id === selected)
  return <section className="dash-card demo-assistant">
    <div className="demo-assistant-head"><span className="demo-assistant-logo"><ContentIcon name="sparkle"/></span><div><span className="demo-assistant-eyebrow">SAITHWET AI</span><h2>{my ? 'သင့်လုပ်ငန်းအတွက် AI အကူ' : 'Your business assistant'}</h2><p>{my ? 'နမူနာမေးခွန်းတစ်ခုကို ရွေးပြီး demo ကို စမ်းကြည့်ပါ။' : 'Choose a sample question to explore the demo.'}</p></div><span className="demo-assistant-badge">{my ? 'နမူနာ DEMO' : 'SAMPLE DEMO'}</span></div>
    <div className="demo-assistant-conversation" aria-live="polite">
      <div className="demo-assistant-reply"><ContentIcon name="sparkle"/><p>{my ? 'မင်္ဂလာပါ။ နမူနာဆိုင်ရဲ့ အော်ဒါ၊ လက်ကျန်နဲ့ ရောင်းအားကို ကြည့်ရအောင်။' : 'Hello! Let’s explore the sample shop’s orders, inventory and sales.'}</p></div>
      {example && <><div className="demo-assistant-question">{example.question}</div><div className="demo-assistant-reply"><ContentIcon name="sparkle"/><p>{example.answer}</p></div></>}
    </div>
    <div className="demo-assistant-prompts"><strong>{my ? 'နမူနာမေးခွန်းများ' : 'Sample questions'}</strong><div>{examples.map(item => <button className={selected===item.id ? 'active' : ''} type="button" key={item.id} onClick={()=>setSelected(item.id)}>{item.question}<span aria-hidden="true">↗</span></button>)}</div></div>
    <p className="demo-assistant-note">ⓘ &nbsp;{my ? 'ကြိုတင်ရေးထားသော နမူနာအဖြေများ ဖြစ်ပါသည်။ Live AI သို့မဟုတ် လက်ရှိဆိုင် data နှင့် မချိတ်ဆက်ထားပါ။' : 'These are prepared sample responses, not live AI or your current shop data.'}</p>
  </section>
}
