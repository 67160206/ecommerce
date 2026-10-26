'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
const slides = [
  { img: '/slides/s1.svg', t: 'Flow Lab', s: 'วิตามินและอาหารเสริมคุณภาพ เพื่อสุขภาพที่ไหลลื่นในทุกวัน', cta: 'ดูสินค้าทั้งหมด', href: '/products' },
  { img: '/slides/s2.svg', t: 'สั่งง่าย ติดตามได้', s: 'เลือกสินค้า ใส่ตะกร้า ยืนยันคำสั่งซื้อ แล้วดูสถานะออเดอร์ได้จากบัญชีของคุณ', cta: 'สมัครสมาชิก', href: '/register' },
  { img: '/slides/s3.svg', t: 'สินค้าแนะนำประจำร้าน', s: 'วิตามิน แร่ธาตุ และสมุนไพร ที่มีในสต็อกพร้อมสั่งซื้อทันที', cta: 'ดูสินค้าแนะนำ', href: '/#featured' },
]
export default function Hero() {
  const [i, setI] = useState(0)
  const go = (n: number) => setI((n + slides.length) % slides.length)
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % slides.length), 5000); return () => clearInterval(t) }, [])
  return <div className="relative h-[380px] overflow-hidden bg-navy text-white md:h-[460px]">
    {slides.map((x, n) => <div key={n} aria-hidden={n !== i} className={`absolute inset-0 bg-cover bg-right transition-opacity md:bg-center duration-700 ${n === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`} style={{ backgroundImage: `url(${x.img})` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-transparent md:via-navy/20" />
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-14"><div className="max-w-md">
        <h1 className="text-3xl font-extrabold md:text-5xl">{x.t}</h1><p className="mt-3 text-base text-sky-100 md:text-lg">{x.s}</p>
        <Link href={x.href} className="mt-6 inline-block rounded-md bg-leaf px-6 py-3 font-semibold text-white hover:opacity-90">{x.cta}</Link></div></div></div>)}
    <button aria-label="ก่อนหน้า" onClick={() => go(i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-1 text-2xl hover:bg-black/50">‹</button>
    <button aria-label="ถัดไป" onClick={() => go(i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-1 text-2xl hover:bg-black/50">›</button>
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">{slides.map((_, n) => <button key={n} aria-label={`สไลด์ ${n + 1}`} onClick={() => setI(n)} className={`h-2.5 w-2.5 rounded-full ${n === i ? 'bg-white' : 'bg-white/40'}`} />)}</div>
  </div>
}
