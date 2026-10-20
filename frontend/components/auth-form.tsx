'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Label } from './ui'
export default function AuthForm({ mode, next }: { mode: 'login' | 'register'; next: string }) {
  const r = useRouter()
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/' + mode, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(f)) })
    const j = await res.json()
    if (!res.ok) return setErr(j.error)
    r.push(next.startsWith('/') ? next : '/'); r.refresh()
  }
  return <Card className="mx-auto max-w-sm"><h1 className="mb-2 text-2xl font-bold">{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h1>
    <form onSubmit={submit}>
      {mode === 'register' && <><Label>ชื่อ</Label><Input name="name" required /></>}
      <Label>อีเมล</Label><Input name="email" type="email" required />
      <Label>รหัสผ่าน</Label><Input name="password" type="password" required />
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <Button className="mt-4">{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</Button>
    </form>
    {mode === 'login' && <p className="mt-3 text-xs text-slate-500">ทดลองใช้: admin@shop.test / admin123 · user@shop.test / user123</p>}
  </Card>
}
