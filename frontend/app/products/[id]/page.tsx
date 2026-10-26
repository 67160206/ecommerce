import Link from 'next/link'
import { notFound } from 'next/navigation'
import { get } from '@/lib/api'
import type { Product } from '@/lib/types'
import { baht } from '@/lib/utils'
import { Badge, Button, Card, Pimg } from '@/components/ui'
import { AddToCart } from '@/components/cart'
export default async function Detail({ params }: { params: { id: string } }) {
  const p = await get<Product>('/products/' + Number(params.id))
  if (!p || !p.isActive) notFound()
  return <div>
    <Link href="/products" className="text-sm text-slate-500">‹ กลับไปหน้าสินค้า</Link>
    <Card className="mt-2 grid gap-6 md:grid-cols-2">
      <Pimg src={p.imageUrl} className="aspect-square w-full rounded-lg text-8xl" />
      <div><h1 className="text-2xl font-bold">{p.name}</h1><div className="text-sm text-slate-500">{p.category.name}</div>
        <div className="my-2 text-3xl font-extrabold text-brand">{baht(p.price)}</div><p>{p.description}</p>
        <p className="my-3">{p.stock > 0 ? `คงเหลือ ${p.stock} ชิ้น` : <Badge k="LOW">สินค้าหมด</Badge>}</p>
        {p.stock > 0 ? <AddToCart withQty p={{ id: p.id, name: p.name, price: p.price, image: p.imageUrl, stock: p.stock }} /> : <Button disabled>สินค้าหมด</Button>}
      </div>
    </Card></div>
}
