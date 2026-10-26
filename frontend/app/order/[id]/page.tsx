import { notFound } from 'next/navigation'
import { get } from '@/lib/api'
import type { Order } from '@/lib/types'
import { requireUser } from '@/lib/auth'
import { payOrder } from '@/app/actions'
import OrderView from '@/components/order-view'
import { Button, StatusBadge } from '@/components/ui'
export default async function OrderPage({ params }: { params: { id: string } }) {
  const u = await requireUser('/order/' + params.id)
  const o = await get<Order>('/orders/' + Number(params.id))
  if (!o || (o.userId !== u.id && u.role !== 'ADMIN')) notFound()
  return <div><h1 className="mb-3 text-2xl font-bold">คำสั่งซื้อ #{o.id} <StatusBadge s={o.status} /></h1><OrderView o={o} />
    {o.status === 'PENDING' && o.userId === u.id && <form action={payOrder} className="mt-4"><input type="hidden" name="id" value={o.id} /><Button>ชำระเงิน (จำลอง)</Button></form>}</div>
}
