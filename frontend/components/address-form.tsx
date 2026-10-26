import { saveAddress } from '@/app/actions'
import { Button, Input, Label } from './ui'
type A = { id: number; fullName: string; phone: string; line1: string; district: string; province: string; postalCode: string; isDefault: boolean }
export default function AddressForm({ a }: { a?: A }) {
  return <form action={saveAddress}>
    <input type="hidden" name="id" value={a?.id ?? 0} />
    <Label>ชื่อผู้รับ</Label><Input name="fullName" defaultValue={a?.fullName} required />
    <Label>เบอร์โทร</Label><Input name="phone" defaultValue={a?.phone} required />
    <Label>ที่อยู่ (บ้านเลขที่ ถนน)</Label><Input name="line1" defaultValue={a?.line1} required />
    <div className="grid grid-cols-3 gap-2"><div><Label>เขต/อำเภอ</Label><Input name="district" defaultValue={a?.district} /></div><div><Label>จังหวัด</Label><Input name="province" defaultValue={a?.province} /></div><div><Label>รหัสไปรษณีย์</Label><Input name="postalCode" defaultValue={a?.postalCode} /></div></div>
    <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" name="isDefault" defaultChecked={a?.isDefault} /> ตั้งเป็นที่อยู่หลัก</label>
    <Button className="mt-3">บันทึกที่อยู่</Button>
  </form>
}
