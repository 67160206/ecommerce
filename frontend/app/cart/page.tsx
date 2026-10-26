'use client'
import Link from 'next/link'
import { useCart } from '@/components/cart'
import { baht } from '@/lib/utils'
import { Button, Input, Pimg, Table, btn } from '@/components/ui'
export default function CartPage() {
  const { items, setQty, remove, total } = useCart()
  if (!items.length) return <div><h1 className="mb-3 text-2xl font-bold">ตะกร้าสินค้า</h1><p className="mb-3 text-slate-500">ตะกร้าว่างอยู่ เลือกสินค้าจากหน้าร้านได้เลย</p><Link href="/products" className={btn()}>ไปเลือกสินค้า</Link></div>
  return <div><h1 className="mb-3 text-2xl font-bold">ตะกร้าสินค้า</h1>
    <Table><thead><tr><th>สินค้า</th><th>ราคา</th><th>จำนวน</th><th>รวม</th><th></th></tr></thead><tbody>
      {items.map(i => <tr key={i.id}><td className="flex items-center gap-2"><Pimg src={i.image} className="h-9 w-9 rounded text-xl" />{i.name}</td><td>{baht(i.price)}</td>
        <td><Input type="number" min={1} max={i.stock} value={i.qty} onChange={e => setQty(i.id, Number(e.target.value))} className="w-20" /></td>
        <td>{baht(i.price * i.qty)}</td><td><Button variant="outline" className="px-3 py-1" onClick={() => remove(i.id)}>ลบ</Button></td></tr>)}
    </tbody></Table>
    <p className="my-4 text-right text-xl">ยอดรวม <b className="text-brand">{baht(total)}</b></p>
    <p className="text-right"><Link href="/checkout" className={btn()}>ดำเนินการสั่งซื้อ</Link></p></div>
}
