import type { ReactNode } from 'react'

const icons: Record<string, ReactNode> = {
  box: <><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/></>,
  orders: <><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  stock: <><path d="M4 20h16M6 16v-5M12 16V8M18 16V4"/><path d="m15 7 3-3 3 3"/></>,
  down: <><path d="M12 4v13m-5-5 5 5 5-5M5 21h14"/></>,
  wallet: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-5 5h2"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5"/></>,
  eye: <><path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  pencil: <><path d="M12 20h8"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  sparkle: <><path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z"/><path d="m19 16 .7 1.8L21.5 18l-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.2L19 16Z"/></>,
  share: <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></>,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  send: <><path d="m21 3-7.2 18-3.1-7.7L3 10.2 21 3Z"/><path d="M10.7 13.3 21 3"/></>,
}
export default function ContentIcon({ name }: { name: string }) {
  const aliases: Record<string, string> = { '◇': 'box', '▤': 'orders', '↓': 'down', '▣': 'wallet', '✓': 'check', '◷': 'clock', '♙': 'users', '↗': 'stock', '✧': 'sparkle' }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[aliases[name] ?? name] ?? icons.sparkle}</svg>
}
