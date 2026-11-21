import type { ShopSettings } from './WorkspaceSections'
import ContentIcon from './ContentIcon'
import '../../styles/account.css'

type Props = { my: boolean; settings: ShopSettings; name: string; onSettings: () => void }

export default function ProfilePage({ my, settings, name, onSettings }: Props) {
  const t = (en: string, mm: string) => my ? mm : en
  const display = settings.displayName?.trim() || name
  const features = [
    [t('AI order drafting', 'AI ဖြင့် အော်ဒါ draft ပြုလုပ်ခြင်း'), 'sparkle'],
    [t('Customer and stock workspace', 'ဝယ်ယူသူနှင့် လက်ကျန် စီမံခန့်ခွဲမှု'), 'users'],
    [t('Orders, payments and reports', 'အော်ဒါ၊ ငွေပေးချေမှုနှင့် အစီရင်ခံစာ'), 'orders'],
  ]

  return <div className="account-page">
    <section className="account-card profile-hero">
      <span className="profile-avatar">{settings.photo ? <img src={settings.photo} alt="" /> : display.slice(0, 1).toUpperCase()}</span>
      <div className="profile-identity">
        <span className="account-kicker">MY PROFILE</span>
        <h1>{display}</h1>
        <p>{settings.shop || t('Your seller workspace', 'သင့်အရောင်းလုပ်ငန်းခွင်')}</p>
      </div>
      <button type="button" className="profile-edit" onClick={onSettings}>{t('Edit profile', 'Profile ပြင်မည်')}</button>
    </section>

    <div className="profile-grid">
      <section className="account-card profile-plan-card">
        <div className="profile-plan-top">
          <span className="profile-plan-icon" aria-hidden="true"><ContentIcon name="sparkle" /></span>
          <span className="profile-plan-status"><ContentIcon name="check" />{t('Active', 'အသုံးပြုနေသည်')}</span>
        </div>
        <span className="account-kicker">SUBSCRIPTION</span>
        <h2>{t('Growth plan', 'Growth plan')}</h2>
        <p className="profile-plan-copy">{t('A complete workspace for growing social sales.', 'Social sales လုပ်ငန်းတိုးတက်ရေးအတွက် စုံလင်သော workspace ပါ။')}</p>
        <div className="profile-plan-price"><strong>30,000 MMK</strong><span>{t('/ month', '/ လ')}</span></div>
        <ul className="profile-plan-features">
          {features.map(([label, icon]) => <li key={label}><span aria-hidden="true"><ContentIcon name={icon} /></span>{label}</li>)}
        </ul>
        <p className="profile-plan-note">{t('Your current plan is shown for this prototype.', 'လက်ရှိ plan ကို prototype အတွက် ပြသထားခြင်းဖြစ်ပါသည်။')}</p>
      </section>

      <section className="account-card profile-history-card">
        <div className="account-card-heading">
          <div>
            <span className="account-kicker">HISTORY</span>
            <h2>{t('Plan history', 'Plan မှတ်တမ်း')}</h2>
            <p>{t('Your current subscription status.', 'သင့်လက်ရှိ subscription အခြေအနေ။')}</p>
          </div>
        </div>
        <div className="profile-history-entry">
          <span className="profile-history-icon" aria-hidden="true"><ContentIcon name="check" /></span>
          <div>
            <strong>{t('Growth plan is active', 'Growth plan ကို အသုံးပြုနေသည်')}</strong>
            <small>{t('30,000 MMK / month', '30,000 MMK / လ')}</small>
          </div>
          <span className="profile-history-tag">{t('Current', 'လက်ရှိ')}</span>
        </div>
        <div className="profile-billing-summary">
          <span>{t('Billing', 'ငွေပေးချေမှု')}</span>
          <strong>{t('Monthly plan', 'လစဉ် plan')}</strong>
          <small>{t('Provider setup pending', 'Provider ချိတ်ဆက်ရန် ကျန်ရှိသည်')}</small>
        </div>
      </section>
    </div>

    <section className="account-card">
      <div className="account-card-heading">
        <div>
          <span className="account-kicker">WE’RE HERE TO HELP</span>
          <h2>{t('Contact support', 'Support ကို ဆက်သွယ်ရန်')}</h2>
          <p>{t('Contact details will be available when provided.', 'ဆက်သွယ်ရန် အချက်အလက်များ သတ်မှတ်ပြီးလျှင် ဤနေရာတွင် ပြပါမည်။')}</p>
        </div>
      </div>
      <div className="profile-contact-grid">
        {[[t('Phone', 'ဖုန်း'), '☎'], ['Email', '✉'], ['Telegram', '➤']].map(([label, icon]) => <div className="profile-contact" key={label}><span aria-hidden="true">{icon}</span><div><strong>{label}</strong><small>{t('Not set yet', 'မသတ်မှတ်ရသေး')}</small></div></div>)}
      </div>
    </section>
  </div>
}
