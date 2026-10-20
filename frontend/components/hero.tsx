'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
const slides = [
  { t: 'Flow Lab', s: 'วิตามินและอาหารเสริมคุณภาพ เพื่อสุขภาพที่ไหลลื่นในทุกวัน', cta: 'ดูสินค้าทั้งหมด', href: '/products' },
  { t: 'สั่งง่าย ติดตามได้', s: 'เลือกสินค้า ใส่ตะกร้า ยืนยันคำสั่งซื้อ แล้วดูสถานะออเดอร์ได้จากบัญชีของคุณ', cta: 'สมัครสมาชิก', href: '/register' },
  { t: 'สินค้าแนะนำประจำร้าน', s: 'คัดสินค้าที่มีในสต็อกมาให้เลือกได้ทันที', cta: 'ดูสินค้าแนะนำ', href: '/#featured' },
]
export default function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % slides.length), 5000); return () => clearInterval(t) }, [])
  const s = slides[i]
  return <div className="relative overflow-hidden bg-gradient-to-br from-navy to-brand text-white">
    <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-14 md:grid-cols-2">
      <div><h1 className="text-4xl font-extrabold md:text-5xl">{s.t}</h1><p className="mt-3 max-w-md text-lg text-sky-100">{s.s}</p>
        <Link href={s.href} className="mt-6 inline-block rounded-md bg-leaf px-6 py-3 font-semibold text-white hover:opacity-90">{s.cta}</Link></div>
      <img src="/logo.png" alt="Flow Lab" className="mx-auto h-56 w-56 rounded-3xl object-cover md:h-72 md:w-72" />
    </div>
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">{slides.map((_, n) => <button key={n} aria-label={`สไลด์ ${n + 1}`} onClick={() => setI(n)} className={`h-2.5 w-2.5 rounded-full ${n === i ? 'bg-white' : 'bg-white/40'}`} />)}</div>
  </div>
}
