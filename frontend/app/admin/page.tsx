import Link from 'next/link'
import { get } from '@/lib/api'
import type { OrderRow, Product } from '@/lib/types'
import { baht } from '@/lib/utils'
import { Card, StatusBadge, Table, btn } from '@/components/ui'
import RevenueChart from '@/components/revenue-chart'
type D = { revenue: number; orders: number; pending: number; low: Product[]; daily: { date: string; revenue: number }[]; recent: OrderRow[] }
export default async function Dashboard() {
  const d = await get<D>('/dashboard')
  if (!d) return <p className="text-red-600">โหลดข้อมูลแดชบอร์ดไม่สำเร็จ</p>
  const stats: [string, string | number][] = [['รายได้รวม', baht(d.revenue)], ['จำนวนออเดอร์', d.orders], ['รอจัดการ', d.pending], ['สินค้าใกล้หมด', d.low.length]]
  return <div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{stats.map(([l, v]) => <Card key={l}><span className="text-sm text-slate-500">{l}</span><b className="block text-2xl">{v}</b></Card>)}</div>
    <h2 className="mb-2 mt-6 font-bold">รายได้ 7 วันล่าสุด</h2><Card><RevenueChart data={d.daily} /></Card>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div><h2 className="mb-2 font-bold">ออเดอร์ล่าสุด</h2>{d.recent.length ? <Table><tbody>{d.recent.map(o => <tr key={o.id}><td><Link href={`/admin/orders/${o.id}`} className="text-brand">#{o.id}</Link></td><td>{o.shippingName}</td><td>{baht(o.totalAmount)}</td><td><StatusBadge s={o.status} /></td></tr>)}</tbody></Table> : <p className="text-slate-500">ยังไม่มีออเดอร์</p>}</div>
      <div><h2 className="mb-2 font-bold">สินค้าใกล้หมด</h2>{d.low.length ? <Table><tbody>{d.low.map(p => <tr key={p.id} className="bg-red-50"><td>{p.name}</td><td>เหลือ {p.stock}</td><td><Link href={`/admin/products/${p.id}`} className={btn('outline', 'px-3 py-1')}>แก้สต็อก</Link></td></tr>)}</tbody></Table> : <p className="text-slate-500">สต็อกปกติทุกรายการ</p>}</div>
    </div></div>
}
