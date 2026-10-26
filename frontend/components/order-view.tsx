import type { Order } from '@/lib/types'
import { baht } from '@/lib/utils'
import { Card } from './ui'
export default function OrderView({ o }: { o: Order }) {
  return <div className="grid gap-4 md:grid-cols-2">
    <Card><b>ผู้รับ</b><p>{o.shippingName} · {o.shippingPhone}</p><p className="whitespace-pre-line">{o.shippingAddress}</p><p className="text-sm text-slate-500">สั่งเมื่อ {new Date(o.createdAt).toLocaleString('th-TH')}</p></Card>
    <Card>{o.items.map(i => <div key={i.id} className="flex justify-between"><span>{i.product.name} × {i.quantity}</span><span>{baht(i.unitPrice * i.quantity)}</span></div>)}
      <hr className="my-2" /><b className="flex justify-between"><span>รวม</span><span className="text-brand">{baht(o.totalAmount)}</span></b></Card></div>
}
