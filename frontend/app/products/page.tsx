import Link from 'next/link'
import { get } from '@/lib/api'
import type { Category, Product } from '@/lib/types'
import { baht } from '@/lib/utils'
import { Badge, Button, Card, Input, Pimg, Select } from '@/components/ui'
import { AddToCart } from '@/components/cart'
export default async function Home({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const q = (searchParams.q || '').trim(), c = Number(searchParams.category) || 0
  const [cats, ps] = await Promise.all([
    get<Category[]>('/categories').then(x => x ?? []),
    get<Product[]>('/products?' + new URLSearchParams({ q, ...(c ? { category: String(c) } : {}) })).then(x => x ?? []),
  ])
  return <div>
    <h1 className="mb-4 text-2xl font-bold">สินค้าทั้งหมด</h1>
    <form className="mb-5 flex flex-wrap gap-2">
      <Input name="q" defaultValue={q} placeholder="ค้นหาชื่อสินค้า" className="min-w-40 flex-[2]" />
      <Select name="category" defaultValue={c || ''} className="min-w-36 flex-1"><option value="">ทุกหมวดหมู่</option>{cats.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>
      <Button>ค้นหา</Button>
    </form>
    {ps.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{ps.map(p => <Card key={p.id}>
      <Link href={`/products/${p.id}`}><Pimg src={p.imageUrl} className="mb-2 h-28 w-full rounded-lg" /><b>{p.name}</b></Link>
      <div className="text-sm text-slate-500">{p.category.name}</div>
      <div className="font-extrabold text-brand">{baht(p.price)}</div>
      <div className="mt-2">{p.stock > 0 ? <AddToCart p={{ id: p.id, name: p.name, price: p.price, image: p.imageUrl, stock: p.stock }} /> : <Badge k="LOW">สินค้าหมด</Badge>}</div>
    </Card>)}</div> : <p className="text-slate-500">ไม่พบสินค้า ลองเปลี่ยนคำค้นหรือหมวดหมู่</p>}
  </div>
}
