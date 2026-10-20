import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <div><h1 className="mb-3 text-2xl font-bold">ระบบหลังบ้าน</h1>
    <div className="mb-4 flex gap-2">{[['/admin', 'แดชบอร์ด'], ['/admin/products', 'สินค้าและสต็อก'], ['/admin/orders', 'คำสั่งซื้อ']].map(([h, l]) => <Link key={h} href={h} className="rounded-full border px-3 py-1">{l}</Link>)}</div>{children}</div>
}
