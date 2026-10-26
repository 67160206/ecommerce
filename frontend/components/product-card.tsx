import Link from 'next/link'
import { baht } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { Badge, Card, Pimg } from './ui'
import { AddToCart } from './cart'
export default function ProductCard({ p }: { p: Product }) {
  return <Card>
    <Link href={`/products/${p.id}`}><Pimg src={p.imageUrl} className="mb-2 aspect-square w-full rounded-lg" /><b>{p.name}</b></Link>
    <div className="text-sm text-slate-500">{p.category.name}</div>
    <div className="font-extrabold text-brand">{baht(p.price)}</div>
    <div className="mt-2">{p.stock > 0 ? <AddToCart p={{ id: p.id, name: p.name, price: p.price, image: p.imageUrl, stock: p.stock }} /> : <Badge k="LOW">สินค้าหมด</Badge>}</div>
  </Card>
}
