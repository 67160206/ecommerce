import Link from 'next/link'
import { get } from '@/lib/api'
import type { Product } from '@/lib/types'
import { deleteProduct } from '@/app/actions'
import { baht } from '@/lib/utils'
import { Badge, Button, Pimg, Table, btn } from '@/components/ui'
export default async function Products() {
  const ps = (await get<Product[]>('/products?all=1')) ?? []
  return <div><p className="mb-3"><Link href="/admin/products/new" className={btn()}>+ เพิ่มสินค้า</Link></p>
    <Table><thead><tr><th>สินค้า</th><th>หมวดหมู่</th><th>ราคา</th><th>สต็อก</th><th>สถานะ</th><th></th></tr></thead><tbody>
      {ps.map(p => { const low = p.isActive && p.stock <= p.lowStockThreshold
        return <tr key={p.id} className={low ? 'bg-red-50' : ''}><td className="flex items-center gap-2"><Pimg src={p.imageUrl} className="h-8 w-8 rounded text-xl" />{p.name}</td><td>{p.category.name}</td><td>{baht(p.price)}</td><td>{p.stock}</td>
          <td>{!p.isActive ? <Badge k="PENDING">ซ่อนอยู่</Badge> : low ? <Badge k="LOW">ใกล้หมด</Badge> : <Badge k="OK">ปกติ</Badge>}</td>
          <td className="flex gap-2"><Link href={`/admin/products/${p.id}`} className={btn('outline', 'px-3 py-1')}>แก้ไข</Link>
            <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><Button variant="danger" className="px-3 py-1">ลบ</Button></form></td></tr> })}
    </tbody></Table><p className="mt-2 text-xs text-slate-500">สินค้าที่เคยมีออเดอร์จะถูกซ่อนแทนการลบ เพื่อไม่ให้ประวัติคำสั่งซื้อเสียหาย</p></div>
}
