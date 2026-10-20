import Link from 'next/link'
import { requireUser } from '@/lib/auth'
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireUser('/account')
  return <div><h1 className="mb-3 text-2xl font-bold">บัญชีของฉัน</h1>
    <div className="mb-4 flex gap-2">{[['/account', 'ประวัติการสั่งซื้อ'], ['/account/profile', 'โปรไฟล์และที่อยู่']].map(([h, l]) => <Link key={h} href={h} className="rounded-full border px-3 py-1">{l}</Link>)}</div>{children}</div>
}
