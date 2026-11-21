import { useId } from 'react'

type Props = { index: number }

// Each icon has its own gradient IDs so repeated landing-page elements do not clash.
export default function FeatureIllustration({ index }: Props) {
  const id = useId().replaceAll(':', '')
  const gradients = [
    ['#7da4e5', '#9bc8e4'], ['#a395df', '#edb4cb'], ['#70b5aa', '#b7d8bf'],
    ['#e4a984', '#e9c898'], ['#8eadd9', '#bca9d3'], ['#9c9cda', '#8bc2c1'],
  ] as const
  const [start, end] = gradients[index % gradients.length]
  return <svg className="landing-feature-art" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <defs><linearGradient id={`feature-${id}`} x1="8" y1="7" x2="54" y2="57" gradientUnits="userSpaceOnUse"><stop stopColor={start}/><stop offset="1" stopColor={end}/></linearGradient></defs>
    <circle cx="32" cy="32" r="27" fill={`url(#feature-${id})`} opacity=".16"/>
    {index === 0 && <><path d="M14 19a7 7 0 0 1 7-7h22a7 7 0 0 1 7 7v16a7 7 0 0 1-7 7H29l-10 8v-8h-1a4 4 0 0 1-4-4V19Z" fill={`url(#feature-${id})`}/><path d="M23 23h18M23 29h13" stroke="white" strokeWidth="3" strokeLinecap="round"/><circle cx="47" cy="45" r="7" fill="#eeb99f"/><path d="m44 45 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>}
    {index === 1 && <><rect x="17" y="13" width="30" height="38" rx="6" fill={`url(#feature-${id})`}/><path d="M25 23h14M25 30h14M25 37h8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="m44 34 2.3 5.7L52 42l-5.7 2.3L44 50l-2.3-5.7L36 42l5.7-2.3L44 34Z" fill="#f3cf9e" stroke="white" strokeWidth="1.5"/></>}
    {index === 2 && <><path d="m15 22 17-9 17 9v19l-17 9-17-9V22Z" fill={`url(#feature-${id})`}/><path d="m15 22 17 9 17-9M32 31v19M24 17l17 9" stroke="white" strokeWidth="2.3" strokeLinejoin="round"/><circle cx="46" cy="46" r="7" fill="#e5b690"/><path d="M46 42v8M42 46h8" stroke="white" strokeWidth="2" strokeLinecap="round"/></>}
    {index === 3 && <><rect x="13" y="17" width="39" height="31" rx="7" fill={`url(#feature-${id})`}/><path d="M13 27h39" stroke="white" strokeWidth="3"/><rect x="20" y="35" width="10" height="4" rx="2" fill="white"/><circle cx="45" cy="43" r="8" fill="#83b9ae"/><path d="m41 43 3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>}
    {index === 4 && <><path d="M14 20a7 7 0 0 1 7-7h22a7 7 0 0 1 7 7v13a7 7 0 0 1-7 7H31l-9 8v-8h-1a7 7 0 0 1-7-7V20Z" fill={`url(#feature-${id})`}/><path d="M22 24h17M22 30h11" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="m44 36 2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill="#f1c69d"/></>}
    {index === 5 && <><rect x="14" y="18" width="36" height="29" rx="10" fill={`url(#feature-${id})`}/><path d="M32 11v7M27 11h10" stroke="#8195bc" strokeWidth="3" strokeLinecap="round"/><circle cx="25" cy="30" r="2.5" fill="white"/><circle cx="39" cy="30" r="2.5" fill="white"/><path d="M26 38c4 3 8 3 12 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="m48 10 1.5 3.5L53 15l-3.5 1.5L48 20l-1.5-3.5L43 15l3.5-1.5L48 10Z" fill="#efc49e"/></>}
  </svg>
}
