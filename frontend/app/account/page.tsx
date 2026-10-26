import Link from 'next/link'
import { get } from '@/lib/api'
import type { OrderRow } from '@/lib/types'
import { requireUser } from '@/lib/auth'
import { baht } from '@/lib/utils'
import { StatusBadge, Table, btn } from '@/components/ui'
export default async function Orders() {
  await requireUser('/account')
  const os = (await get<OrderRow[]>('/orders')) ?? []
  if (!os.length) return <p className="text-slate-500">ยังไม่มีคำสั่งซื้อ</p>
  return <Table><thead><tr><th>เลขที่</th><th>วันที่</th><th>ยอดรวม</th><th>สถานะ</th><th></th></tr></thead><tbody>
    {os.map(o => <tr key={o.id}><td>#{o.id}</td><td>{new Date(o.createdAt).toLocaleDateString('th-TH')}</td><td>{baht(o.totalAmount)}</td><td><StatusBadge s={o.status} /></td><td><Link href={`/order/${o.id}`} className={btn('outline', 'px-3 py-1')}>ดูรายละเอียด</Link></td></tr>)}</tbody></Table>
}
