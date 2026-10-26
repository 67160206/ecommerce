import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getUser } from '@/lib/auth'
import { CartProvider, CartLink } from '@/components/cart'
import { SITE } from '@/lib/site'
export const metadata: Metadata = { title: 'Flow Lab – วิตามินและอาหารเสริม', icons: '/logo-mark.png' }
export const dynamic = 'force-dynamic'
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const u = await getUser()
  return (
    <html lang="th">
      <head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;800&display=swap" /></head>
      <body className="bg-slate-50 font-['Noto_Sans_Thai',sans-serif] text-slate-900">
        <CartProvider>
          <header className="text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-navy px-5 py-1.5 text-xs">
              <span>โทร {SITE.phone} · LINE {SITE.line}</span>
              <div className="flex flex-wrap items-center gap-3">
                {u ? <>
                  {u.role === 'ADMIN' && <Link href="/admin">แอดมิน</Link>}
                  <Link href="/account">{u.name}</Link>
                  <form action="/api/auth/logout" method="post"><button>ออกจากระบบ</button></form>
                </> : <><Link href="/login">เข้าสู่ระบบ</Link><Link href="/register">สมัครสมาชิก</Link></>}
                <CartLink />
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b bg-white px-5 py-2 text-sm text-slate-800">
              <Link href="/" className="mr-auto flex items-center gap-2 text-xl font-extrabold text-navy"><img src="/logo-mark.png" alt="" className="h-9 w-auto" />Flow Lab</Link>
              {[['/', 'หน้าแรก'], ['/#about', 'เกี่ยวกับเรา'], ['/products', 'สินค้า'], ['/#howto', 'วิธีการสั่งซื้อ'], ['/#reviews', 'รีวิว'], ['/#articles', 'บทความ'], ['/#contact', 'ติดต่อเรา']].map(([h, l]) => <Link key={h} href={h} className="hover:text-brand">{l}</Link>)}
            </nav>
          </header>
          <main className="mx-auto max-w-6xl p-5">{children}</main>
          <footer id="contact" className="mt-10 bg-navy text-slate-300">
            <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3">
              <div><div className="flex items-center gap-2 text-xl font-extrabold text-white"><img src="/logo-mark.png" alt="" className="h-9 w-auto" />Flow Lab</div><p className="mt-3 text-sm">วิตามินและอาหารเสริม สั่งง่าย ติดตามออเดอร์ได้</p></div>
              <div className="space-y-1 text-sm"><b className="text-white">ติดต่อเรา</b><p>โทร: {SITE.phone}</p><p>อีเมล: {SITE.email}</p><p>ที่อยู่: {SITE.address}</p><p>เวลาทำการ: {SITE.hours}</p></div>
              <div className="space-y-1 text-sm"><b className="text-white">เมนู</b><p><Link href="/products">สินค้าทั้งหมด</Link></p><p><Link href="/account">บัญชีของฉัน</Link></p><p><Link href="/cart">ตะกร้าสินค้า</Link></p><p>LINE: {SITE.line}</p></div>
            </div>
            <p className="border-t border-white/10 py-3 text-center text-xs">© Flow Lab. All rights reserved.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
