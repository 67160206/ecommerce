'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from './cart'
import { baht } from '@/lib/utils'
import { Button, Card, Input, Label, Select, Textarea, btn } from './ui'
type Addr = { id: number; fullName: string; phone: string; line1: string; district: string; province: string; postalCode: string; isDefault: boolean }
const fmt = (a: Addr) => [a.line1, a.district, a.province, a.postalCode].filter(Boolean).join(' ')
export default function CheckoutForm({ user, addresses }: { user: { name: string; phone: string }; addresses: Addr[] }) {
  const { items, total, clear } = useCart()
  const r = useRouter()
  const d = addresses.find(a => a.isDefault) || addresses[0]
  const [name, setName] = useState(d?.fullName || user.name)
  const [phone, setPhone] = useState(d?.phone || user.phone)
  const [address, setAddress] = useState(d ? fmt(d) : '')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  function pick(id: string) { const a = addresses.find(x => x.id === Number(id)); if (a) { setName(a.fullName); setPhone(a.phone); setAddress(fmt(a)) } }
  async function submit() {
    if (!name.trim() || !phone.trim() || !address.trim()) return setErr('กรุณากรอกชื่อ เบอร์โทร และที่อยู่ให้ครบ')
    setBusy(true)
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map(i => ({ id: i.id, qty: i.qty })), name, phone, address }) })
    const j = await res.json()
    setBusy(false)
    if (!res.ok) return setErr(j.error)
    clear(); r.push('/order/' + j.id)
  }
  if (!items.length) return <p>ตะกร้าว่างอยู่ <Link href="/products" className={btn()}>ไปเลือกสินค้า</Link></p>
  return <div className="grid gap-5 md:grid-cols-2">
    <Card><h2 className="font-bold">ที่อยู่จัดส่ง</h2>
      {addresses.length > 0 && <><Label>เลือกจากที่อยู่ที่บันทึกไว้</Label><Select defaultValue={d?.id} onChange={e => pick(e.target.value)}>{addresses.map(a => <option key={a.id} value={a.id}>{a.fullName} – {a.line1}</option>)}</Select></>}
      <Label>ชื่อผู้รับ</Label><Input value={name} onChange={e => setName(e.target.value)} />
      <Label>เบอร์โทร</Label><Input value={phone} onChange={e => setPhone(e.target.value)} />
      <Label>ที่อยู่</Label><Textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} />
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}</Card>
    <Card><h2 className="font-bold">สรุปคำสั่งซื้อ</h2>
      {items.map(i => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{baht(i.price * i.qty)}</span></div>)}
      <hr className="my-2" /><b className="flex justify-between"><span>รวมทั้งหมด</span><span className="text-brand">{baht(total)}</span></b>
      <p className="my-2 text-xs text-slate-500">การชำระเงินเป็นแบบจำลอง ไม่มีการตัดเงินจริง</p>
      <Button onClick={submit} disabled={busy}>ยืนยันสั่งซื้อ</Button></Card></div>
}
