import type { Draft } from './MessageToOrder'
export type ConversationSource = { id: string; name: string; channel: string; message: string }
export type PendingDraft = { token: string; productId: string; draft: Draft }
export type Sale = { customer: string; channel: string; productId: string; quantity: number; method: string; paid: boolean; unitPrice: number; delivery: number; color?: string; size?: string; location?: string; phone?: string }
export type SaleResult = { ok: true; id: string } | { ok: false; reason: 'stock' | 'storage' | 'invalid' }
