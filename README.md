# SaiThwet — ဆိုင်သွက်

SaiThwet သည် Facebook, Messenger, Telegram နှင့် TikTok မှ ရောင်းချသူများအတွက် ရည်ရွယ်ထားသော social-commerce workspace prototype ဖြစ်သည်။ စာများ၊ အော်ဒါ၊ ပစ္စည်းလက်ကျန်၊ ငွေပေးချေမှု၊ ဝယ်ယူသူနှင့် စာရင်းအချက်အလက်များကို dashboard တစ်ခုထဲတွင် ပြသရန် ဒီဇိုင်းရေးဆွဲထားပါသည်။

## ပါဝင်သောအရာများ

- မြန်မာ / English ဘာသာစကားနှင့် light / dark theme
- Dashboard overview နှင့် အော်ဒါ status အနှစ်ချုပ်
- Customer message မှ AI order draft အဖြစ် ပြသသော presentation flow
- Inbox မှ order ကို အတည်ပြုလျှင် payment record ထည့်သွင်းပြီး product stock လျော့သွားသော local demo flow
- Products, orders, payment history, customers နှင့် analytics pages
- Customer information ကို ကြည့်ရန်၊ ပြင်ရန်နှင့် customer list မှ ဖယ်ရှားရန်
- Profile, settings, channel connection အချက်အလက်နှင့် Growth plan display
- Mobile, tablet နှင့် desktop အတွက် responsive layout

## Growth plan demo

Profile page တွင် **Growth plan — 30,000 MMK / လ** ကို လက်ရှိအသုံးပြုနေသော plan အဖြစ် ပြထားပါသည်။ ၎င်းသည် product presentation အတွက် static subscription display ဖြစ်ပြီး အမှန်တကယ် billing၊ renewal သို့မဟုတ် payment provider ကို မချိတ်ဆက်ထားသေးပါ။

## Local မှ run ရန်

```bash
npm install
npm run dev
```

Vite ပြသပေးသော local address ကို browser တွင် ဖွင့်ပါ။ Production build စစ်ရန် `npm run build` နှင့် lint စစ်ရန် `npm run lint` ကို သုံးနိုင်ပါသည်။

## Project structure

- `src/pages/` — page composition
- `src/components/dashboard/` — dashboard modules နှင့် demo workflows
- `src/components/layout/` — shared navigation နှင့် branding
- `src/components/landing/` — landing page components
- `src/components/auth/` — UI-only login / registration dialog
- `src/context/` — language နှင့် theme preferences
- `src/data/` — Burmese နှင့် English copy
- `src/styles/` — shared styles နှင့် responsive rules
- `src/assets/` နှင့် `public/` — static assets

## Prototype အခြေအနေ

ဒီ project သည် front-end prototype ဖြစ်ပါသည်။ Workspace data များကို browser ရဲ့ `localStorage` တွင်သာ သိမ်းဆည်းသောကြောင့် browser data ဖျက်ပါက ပျောက်နိုင်ပြီး device များအကြား မမျှဝေပါ။

Social channels, live AI service, real account authentication, payment provider နှင့် real subscription billing မချိတ်ဆက်ထားသေးပါ။ AI order draft နှင့် assistant reply များသည် presentation အတွက် ကြိုတင်သတ်မှတ်ထားသော sample data ဖြစ်ပါသည်။ Inbox မှ order ကို confirm လုပ်သည့်အခါ local order/payment record နှင့် stock ကိုသာ update လုပ်ပါသည်။

`api/extract-order.js` သည် optional Vercel Function အဖြစ်ရှိသော်လည်း လက်ရှိ demo UI မှ မခေါ်ယူပါ။ Production တွင် အသုံးပြုလိုပါက server-side API key, authentication, authorization, rate limiting နှင့် persistent database ကို ထည့်သွင်းရန်လိုအပ်ပါသည်။
