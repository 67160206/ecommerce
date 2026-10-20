import { notFound } from 'next/navigation'
import { get } from '@/lib/api'
import type { Category, Product } from '@/lib/types'
import { saveProduct } from '@/app/actions'
import { Button, Card, Input, Label, Select, Textarea } from '@/components/ui'
export default async function Edit({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'
  const [cats, p] = await Promise.all([get<Category[]>('/categories').then(x => x ?? []), isNew ? Promise.resolve(null) : get<Product>('/products/' + Number(params.id))])
  if (!isNew && !p) notFound()
  return <Card className="max-w-lg"><h2 className="font-bold">{isNew ? 'เพิ่มสินค้าใหม่' : 'แก้ไขสินค้า'}</h2>
    <form action={saveProduct}><input type="hidden" name="id" value={params.id} />
      <Label>ชื่อสินค้า</Label><Input name="name" defaultValue={p?.name} required />
      <Label>หมวดหมู่</Label><Select name="categoryId" defaultValue={p?.categoryId}>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
      <Label>ราคา (บาท)</Label><Input name="price" type="number" min={1} step="any" defaultValue={p?.price} required />
      <Label>จำนวนสต็อก</Label><Input name="stock" type="number" min={0} defaultValue={p?.stock ?? 0} />
      <Label>แจ้งเตือนเมื่อสต็อกเหลือไม่เกิน</Label><Input name="low" type="number" min={0} defaultValue={p?.lowStockThreshold ?? 5} />
      <Label>รูปสินค้า (URL หรืออีโมจิ)</Label><Input name="imageUrl" defaultValue={p?.imageUrl ?? '💊'} />
      <Label>คำอธิบาย</Label><Textarea name="description" rows={3} defaultValue={p?.description} />
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={p?.isActive ?? true} /> แสดงในหน้าร้าน</label>
      <Button className="mt-4">บันทึก</Button></form></Card>
}
