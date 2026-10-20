import { notFound } from 'next/navigation'
import { get } from '@/lib/api'
import type { Order } from '@/lib/types'
import { setOrderStatus } from '@/app/actions'
import { STATUS } from '@/lib/utils'
import OrderView from '@/components/order-view'
import { Button, Card, Label, Select, StatusBadge } from '@/components/ui'
export default async function AdminOrder({ params }: { params: { id: string } }) {
  const o = await get<Order>('/orders/' + Number(params.id))
  if (!o) notFound()
  return <div><h2 className="mb-3 text-xl font-bold">ออเดอร์ #{o.id} <StatusBadge s={o.status} /></h2><OrderView o={o} />
    <Card className="mt-4 max-w-sm"><form action={setOrderStatus}><input type="hidden" name="id" value={o.id} /><Label>เปลี่ยนสถานะ</Label>
      <Select name="status" defaultValue={o.status}>{Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Select>
      <Button className="mt-3">บันทึกสถานะ</Button><p className="mt-2 text-xs text-slate-500">ถ้าเปลี่ยนเป็นยกเลิก ระบบคืนสต็อกให้อัตโนมัติ</p></form></Card></div>
}
