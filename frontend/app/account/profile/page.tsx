import { get } from '@/lib/api'
import type { Address } from '@/lib/types'
import { requireUser } from '@/lib/auth'
import { deleteAddress, saveProfile } from '@/app/actions'
import AddressForm from '@/components/address-form'
import { Badge, Button, Card, Input, Label } from '@/components/ui'
export default async function Profile() {
  const u = await requireUser('/account/profile')
  const as = (await get<Address[]>('/addresses')) ?? []
  return <div className="grid gap-6 md:grid-cols-2">
    <Card className="self-start"><h2 className="font-bold">ข้อมูลส่วนตัว</h2>
      <form action={saveProfile}><Label>ชื่อ</Label><Input name="name" defaultValue={u.name} required /><Label>เบอร์โทร</Label><Input name="phone" defaultValue={u.phone} /><Button className="mt-4">บันทึก</Button></form></Card>
    <div><h2 className="mb-2 font-bold">ที่อยู่จัดส่ง</h2>
      {as.map(a => <Card key={a.id} className="mb-3"><b>{a.fullName}</b> {a.isDefault && <Badge k="OK">ที่อยู่หลัก</Badge>}
        <p className="text-sm">{a.line1} {a.district} {a.province} {a.postalCode} · {a.phone}</p>
        <details className="mt-2"><summary className="cursor-pointer text-sm text-brand">แก้ไข</summary><AddressForm a={a} /></details>
        <form action={deleteAddress} className="mt-2"><input type="hidden" name="id" value={a.id} /><Button variant="danger" className="px-3 py-1">ลบ</Button></form></Card>)}
      <Card><h3 className="font-bold">เพิ่มที่อยู่ใหม่</h3><AddressForm /></Card></div></div>
}
