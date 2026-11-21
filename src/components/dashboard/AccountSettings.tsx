import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { ShopSettings } from './WorkspaceSections'
import '../../styles/account.css'

type Props = { my: boolean; settings: ShopSettings; name: string; onSave: (value: ShopSettings) => boolean }
const channels = [
  { id:'facebook', name:'Facebook', detail:'Facebook Page' },
  { id:'messenger', name:'Messenger', detail:'Facebook messages' },
  { id:'telegram', name:'Telegram', detail:'Telegram bot' },
  { id:'tiktok', name:'TikTok', detail:'TikTok messages' },
]
function SocialIcon({id}:{id:string}) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{id==='facebook'?<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.4v8h3.1Z"/>:id==='messenger'?<path d="M12 2C6.5 2 2 6.1 2 11.4c0 2.8 1.3 5.1 3.5 6.8V22l3.4-1.9c1 .3 2 .4 3.1.4 5.5 0 10-4.1 10-9.1S17.5 2 12 2Zm1 12.6-2.5-2.7-4.8 2.7 5.3-5.7 2.6 2.7 4.7-2.7-5.3 5.7Z"/>:id==='telegram'?<path d="M21.4 4.6 18.3 20c-.2 1.1-.9 1.4-1.8.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.9L17.7 7c.4-.3-.1-.5-.6-.2L6.5 13.5 2 12.1c-1-.3-1-1 .2-1.5L19.8 3.8c.8-.3 1.6.2 1.6.8Z"/>:<path d="M14 3h3a5.3 5.3 0 0 0 4 4v3a8.4 8.4 0 0 1-4-1.2V16a5 5 0 1 1-4.4-5v3.1a2 2 0 1 0 1.4 1.9V3Z"/>}</svg>
}
export default function AccountSettings({ my, settings, name, onSave }: Props) {
  const [draft,setDraft]=useState(settings)
  const [notice,setNotice]=useState('')
  const [loading,setLoading]=useState(false)
  const request=useRef(0)
  const fileRef=useRef<HTMLInputElement>(null)
  const t=(en:string,mm:string)=>my?mm:en
  const change=(key:keyof ShopSettings,value:string)=>{setDraft(current=>({...current,[key]:value}));setNotice('')}
  const selectPhoto=async(e:ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0], id=++request.current
    setNotice('')
    if(!file){setLoading(false);return}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){setNotice(t('Choose a JPG, PNG or WebP image up to 5 MB.','JPG၊ PNG သို့မဟုတ် WebP ပုံ 5 MB အောက် ရွေးပါ။'));e.target.value='';setLoading(false);return}
    setLoading(true)
    try { const bitmap=await createImageBitmap(file); const scale=Math.min(1,320/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const context=canvas.getContext('2d');if(!context){bitmap.close();throw Error('canvas')};context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();if(id===request.current)change('photo',canvas.toDataURL('image/jpeg',.8)) }
    catch {if(id===request.current)setNotice(t('Could not read this photo.','ပုံကို ဖတ်၍မရပါ။'))} finally {if(id===request.current)setLoading(false)}
  }
  const submit=(e:FormEvent)=>{e.preventDefault();if(loading)return;setNotice(onSave(draft)?t('Settings saved on this device.','ဆက်တင်များကို ဤစက်တွင် သိမ်းပြီးပါပြီ။'):t('Could not save. Check browser storage.','မသိမ်းနိုင်ပါ။ Browser storage ကို စစ်ဆေးပါ။'))}
  return <div className="account-page">
    <section className="account-card"><div className="account-card-heading"><div><span className="account-kicker">CHANNELS</span><h2>{t('Connected channels','ချိတ်ဆက်မှုများ')}</h2><p>{t('Bring your customer conversations together.','Customer စာများကို တစ်နေရာတည်းတွင် စီမံရန်။')}</p></div><span className="account-pill">{t('Not connected','မချိတ်ဆက်ရသေး')}</span></div><div className="account-channels">{channels.map(c=><article key={c.id} className="account-channel"><span className={`account-channel-icon ${c.id}`} aria-hidden="true"><SocialIcon id={c.id}/></span><div><strong>{c.name}</strong><small>{c.detail}</small></div><span className="account-channel-status">{t('Not connected','မချိတ်ရသေး')}</span></article>)}</div><p className="account-caption">{t('Channel connections are not available in this demo.','ဤ demo တွင် channel များကို ချိတ်ဆက်၍ မရသေးပါ။')}</p></section>
    <form className="account-stack" onSubmit={submit}>
      <section className="account-card"><div className="account-card-heading"><div><span className="account-kicker">ACCOUNT</span><h2>{t('Account details','အကောင့်အချက်အလက်')}</h2><p>{t('Choose how you appear in this workspace.','လုပ်ငန်းခွင်တွင် ပြမည့် အမည်နှင့်ပုံကို ပြင်ဆင်ပါ။')}</p></div></div><div className="account-photo-row"><span className="account-photo">{draft.photo?<img src={draft.photo} alt=""/>:(draft.displayName||name).slice(0,1).toUpperCase()}</span><div><label htmlFor="account-photo" className="account-photo-button">{t('Choose photo','ပုံရွေးမည်')}</label><input ref={fileRef} id="account-photo" className="account-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto}/>{draft.photo && <button type="button" className="account-remove-photo" onClick={()=>{request.current++;setLoading(false);change('photo','');if(fileRef.current)fileRef.current.value=''}}>{t('Remove','ဖယ်မည်')}</button>}<small>{loading?t('Preparing photo…','ပုံပြင်ဆင်နေသည်…'):t('Optional · JPG, PNG or WebP · up to 5 MB','JPG၊ PNG၊ WebP · 5 MB အထိ')}</small></div></div><div className="account-form-grid"><label>{t('Display name','ပြသမည့်အမည်')}<input maxLength={80} value={draft.displayName??''} placeholder={name} onChange={e=>change('displayName',e.target.value)}/><small>{t('Display name only; sign-in is not connected.','ပြသမည့်အမည်သာ ဖြစ်ပါသည်။ Login မချိတ်ဆက်ရသေးပါ။')}</small></label><label>{t('Password','စကားဝှက်')}<input type="password" value="" placeholder={t('Not available in demo','Demo တွင် မရသေးပါ')} disabled/><small>{t('Password changes require a real account service.','Password ပြောင်းရန် account service လိုအပ်ပါသည်။')}</small></label></div></section>
      <section className="account-card"><div className="account-card-heading"><div><span className="account-kicker">WORKSPACE</span><h2>{t('Shop details','ဆိုင်အချက်အလက်များ')}</h2><p>{t('The essentials for your shop.','သင့်ဆိုင်၏ အခြေခံအချက်အလက်များ။')}</p></div></div><div className="account-form-grid three">{([{key:'shop',en:'Shop name',mm:'ဆိုင်အမည်'},{key:'owner',en:'Owner',mm:'ပိုင်ရှင်'},{key:'location',en:'Location',mm:'တည်နေရာ'}] as const).map(f=><label key={f.key}>{my?f.mm:f.en}<input value={draft[f.key]} onChange={e=>change(f.key,e.target.value)}/></label>)}</div></section>
      <section className="account-card"><div className="account-card-heading"><div><span className="account-kicker">DELIVERY</span><h2>{t('Delivery fees','ပို့ဆောင်ခများ')}</h2><p>{t('Set your usual fees in MMK.','ပုံမှန်ပို့ဆောင်ခကို ကျပ်ဖြင့် သတ်မှတ်ပါ။')}</p></div></div><div className="account-form-grid three">{([{key:'yangon',en:'Yangon (MMK)',mm:'ရန်ကုန် (MMK)'},{key:'mandalay',en:'Mandalay (MMK)',mm:'မန္တလေး (MMK)'},{key:'other',en:'Other areas (MMK)',mm:'အခြားဒေသ (MMK)'}] as const).map(f=><label key={f.key}>{my?f.mm:f.en}<input type="number" min="0" step="1" value={draft[f.key]} onChange={e=>change(f.key,e.target.value)}/></label>)}</div></section>
      <div className="account-save"><p>{t('Changes are stored on this device.','အချက်အလက်များကို ဤစက်တွင်သာ သိမ်းထားပါသည်။')}</p><button type="submit" disabled={loading}>{t('Save changes','ပြောင်းလဲမှု သိမ်းမည်')}</button></div>{notice&&<p className="account-notice" role="status">{notice}</p>}
    </form>
  </div>
}
