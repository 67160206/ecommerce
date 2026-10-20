import Link from 'next/link'
import { get } from '@/lib/api'
import type { OrderRow } from '@/lib/types'
import { baht, STATUS } from '@/lib/utils'
import { StatusBadge, Table, btn } from '@/components/ui'
export default async function Orders({ searchParams }: { searchParams: { status?: string } }) {
  const st = searchParams.status && STATUS[searchParams.status] ? searchParams.status : undefined
  const os = (await get<OrderRow[]>('/orders' + (st ? '?status=' + st : ''))) ?? []
  return <div><div className="mb-3 flex flex-wrap gap-2"><Link href="/admin/orders" className="rounded-full border px-3 py-1">ทั้งหมด</Link>
    {Object.entries(STATUS).map(([k, l]) => <Link key={k} href={`/admin/orders?status=${k}`} className={`rounded-full border px-3 py-1 ${st === k ? 'bg-brand text-white' : ''}`}>{l}</Link>)}</div>
    {os.length ? <Table><thead><tr><th>เลขที่</th><th>วันที่</th><th>ลูกค้า</th><th>ยอดรวม</th><th>สถานะ</th><th></th></tr></thead><tbody>
      {os.map(o => <tr key={o.id}><td>#{o.id}</td><td>{new Date(o.createdAt).toLocaleDateString('th-TH')}</td><td>{o.shippingName}</td><td>{baht(o.totalAmount)}</td><td><StatusBadge s={o.status} /></td><td><Link href={`/admin/orders/${o.id}`} className={btn('outline', 'px-3 py-1')}>จัดการ</Link></td></tr>)}</tbody></Table>
      : <p className="text-slate-500">ไม่มีออเดอร์ในสถานะนี้</p>}</div>
}
