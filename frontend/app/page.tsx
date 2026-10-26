import Link from 'next/link'
import { get } from '@/lib/api'
import type { Category, Product } from '@/lib/types'
import Hero from '@/components/hero'
import ProductCard from '@/components/product-card'
const ICON = ['🍊', '🦴', '🐟', '💪', '🌿']
const Sec = ({ id, title, sub, alt, children }: { id?: string; title: string; sub?: string; alt?: boolean; children: React.ReactNode }) => (
  <section id={id} className={`bleed scroll-mt-20 ${alt ? 'bg-white' : ''}`}><div className="mx-auto max-w-6xl px-5 py-12">
    <h2 className="text-center text-2xl font-extrabold text-navy">{title}</h2>{sub && <p className="mt-1 text-center text-sm text-slate-500">{sub}</p>}<div className="mt-7">{children}</div></div></section>)

export default async function Landing() {
  const [cats, ps] = await Promise.all([get<Category[]>('/categories').then(x => x ?? []), get<Product[]>('/products').then(x => x ?? [])])
  const featured = ps.filter(p => p.stock > 0).slice(0, 8)
  return <div>
    <div className="bleed -mt-5"><Hero /></div>

    <Sec title="หมวดหมู่สินค้า">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">{cats.map((c, i) => <Link key={c.id} href={`/products?category=${c.id}`} className="group rounded-xl border bg-white p-5 text-center transition hover:border-brand hover:shadow">
        <div className="text-5xl">{ICON[i % ICON.length]}</div><b className="mt-2 block">{c.name}</b><span className="mt-1 inline-block text-sm text-brand group-hover:underline">เลือกซื้อ ›</span></Link>)}</div>
    </Sec>

    <Sec id="featured" title="สินค้าแนะนำ" alt>
      {featured.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div> : <p className="text-center text-slate-500">ยังไม่มีสินค้า</p>}
      <p className="mt-6 text-center"><Link href="/products" className="rounded-md border border-brand px-5 py-2 text-brand hover:bg-brand hover:text-white">ดูสินค้าทั้งหมด</Link></p>
    </Sec>

    <Sec id="about" title="เกี่ยวกับเรา">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <img src="/logo.png" alt="Flow Lab" className="mx-auto h-64 w-64 rounded-3xl object-cover" />
        <div className="space-y-3 text-slate-700"><h3 className="text-xl font-bold text-brand">Flow Lab</h3>
          <p>Flow Lab คือร้านวิตามินและอาหารเสริมออนไลน์ที่รวบรวมสินค้าไว้ในที่เดียว ตั้งแต่วิตามิน แร่ธาตุ น้ำมันปลา โปรตีน ไปจนถึงสมุนไพร</p>
          <p>เราแสดงราคาและจำนวนสต็อกตามจริง ให้คุณสั่งซื้อได้ง่าย และติดตามสถานะคำสั่งซื้อได้ตลอดจนสินค้าถึงมือ</p>
          <p className="text-xs text-slate-400"></p></div></div>
    </Sec>

    <Sec title="จุดเด่นของ Flow Lab" alt>
      <div className="grid gap-4 md:grid-cols-5">{[['🔍', 'คัดสรรสินค้า', 'เลือกสินค้าที่คุ้นเคยและเป็นที่นิยม'], ['🏷️', 'ราคาชัดเจน', 'แสดงราคาตรงไปตรงมา ไม่มีค่าใช้จ่ายแอบแฝง'], ['📦', 'สต็อกอัปเดตทันที', 'เห็นจำนวนคงเหลือจริงก่อนสั่งซื้อ'], ['🚚', 'ติดตามออเดอร์', 'ดูสถานะตั้งแต่ชำระเงินจนส่งมอบ'], ['💬', 'ดูแลหลังการขาย', 'ติดต่อทีมงานได้ผ่านช่องทางของร้าน']].map(([i, t, d]) =>
        <div key={t} className="rounded-xl border bg-slate-50 p-4 text-center"><div className="text-4xl">{i}</div><b className="mt-2 block">{t}</b><p className="mt-1 text-sm text-slate-500">{d}</p></div>)}</div>
    </Sec>

    <Sec id="howto" title="วิธีการสั่งซื้อสินค้า">
      <ol className="grid gap-4 md:grid-cols-4">{['เลือกสินค้าและกดเพิ่มลงตะกร้า', 'ตรวจสอบตะกร้าและกดดำเนินการสั่งซื้อ', 'เลือกหรือกรอกที่อยู่จัดส่ง แล้วยืนยัน', 'ชำระเงินและติดตามสถานะในบัญชีของคุณ'].map((t, i) =>
        <li key={t} className="rounded-xl border bg-white p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-white">{i + 1}</span><p className="mt-3">{t}</p></li>)}</ol>
    </Sec>

    <Sec id="reviews" title="รีวิวจากลูกค้า" sub="(ข้อความตัวอย่าง รอแทนที่ด้วยรีวิวจริง)" alt>
      <div className="grid gap-4 md:grid-cols-3">{[['คุณเอ', 'สั่งง่าย หน้าเว็บใช้สะดวก เห็นสต็อกชัดเจน'], ['คุณบี', 'ติดตามสถานะออเดอร์ได้ ไม่ต้องทักถามบ่อย'], ['คุณซี', 'มีสินค้าให้เลือกหลายหมวด หาของได้เร็ว']].map(([n, t]) =>
        <figure key={n} className="rounded-xl border bg-slate-50 p-5"><blockquote className="text-slate-700">“{t}”</blockquote><figcaption className="mt-3 text-sm font-semibold text-brand">{n}</figcaption></figure>)}</div>
    </Sec>

    <Sec id="articles" title="สาระความรู้และบทความ">
      <div className="grid gap-4 md:grid-cols-3">{['เลือกวิตามินอย่างไรให้เหมาะกับตัวเอง', 'วิธีอ่านฉลากอาหารเสริมให้เข้าใจ', 'เก็บรักษาอาหารเสริมให้คงคุณภาพ'].map(t =>
        <article key={t} className="rounded-xl border bg-white p-5"><div className="mb-3 grid h-24 place-items-center rounded-lg bg-sky-50 text-4xl">📖</div><b>{t}</b><p className="mt-2 text-sm text-slate-400">เร็ว ๆ นี้</p></article>)}</div>
    </Sec>
  </div>
}
