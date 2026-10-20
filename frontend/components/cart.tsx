'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input } from './ui'
export type CartItem = { id: number; name: string; price: number; image: string; stock: number; qty: number }
type Ctx = { items: CartItem[]; add: (p: Omit<CartItem, 'qty'>, n?: number) => void; setQty: (id: number, q: number) => void; remove: (id: number) => void; clear: () => void; count: number; total: number }
const C = createContext<Ctx>(null as unknown as Ctx)
export const useCart = () => useContext(C)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, set] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => { try { set(JSON.parse(localStorage.getItem('fl_cart') || '[]')) } catch {} setReady(true) }, [])
  useEffect(() => { if (ready) localStorage.setItem('fl_cart', JSON.stringify(items)) }, [items, ready])
  const add: Ctx['add'] = (p, n = 1) => set(a => { const f = a.find(x => x.id === p.id); const q = Math.min((f?.qty || 0) + n, p.stock); return f ? a.map(x => x.id === p.id ? { ...x, qty: q, stock: p.stock } : x) : [...a, { ...p, qty: q }] })
  const setQty: Ctx['setQty'] = (id, q) => set(a => a.map(x => x.id === id ? { ...x, qty: Math.max(1, Math.min(q || 1, x.stock)) } : x))
  const remove = (id: number) => set(a => a.filter(x => x.id !== id))
  return <C.Provider value={{ items, add, setQty, remove, clear: () => set([]), count: items.reduce((s, x) => s + x.qty, 0), total: items.reduce((s, x) => s + x.qty * x.price, 0) }}>{children}</C.Provider>
}
export const CartLink = () => <Link href="/cart">🛒 ตะกร้า ({useCart().count})</Link>
export function AddToCart({ p, withQty }: { p: Omit<CartItem, 'qty'>; withQty?: boolean }) {
  const { add } = useCart()
  const [n, setN] = useState(1)
  const [msg, setMsg] = useState('')
  const go = () => { add(p, n); setMsg('เพิ่มลงตะกร้าแล้ว'); setTimeout(() => setMsg(''), 1500) }
  return <div className="flex flex-wrap items-center gap-2">
    {withQty && <Input type="number" min={1} max={p.stock} value={n} onChange={e => setN(Math.max(1, Number(e.target.value) || 1))} className="w-20" />}
    <Button onClick={go} className={withQty ? '' : 'px-3 py-1'}>เพิ่มลงตะกร้า</Button>
    {msg && <span className="text-xs text-emerald-600">{msg}</span>}
  </div>
}
