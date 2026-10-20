import { get } from '@/lib/api'
import type { Address } from '@/lib/types'
import { requireUser } from '@/lib/auth'
import CheckoutForm from '@/components/checkout-form'
export default async function Checkout() {
  const u = await requireUser('/checkout')
  const addresses = (await get<Address[]>('/addresses')) ?? []
  return <div><h1 className="mb-3 text-2xl font-bold">สั่งซื้อสินค้า</h1><CheckoutForm user={{ name: u.name, phone: u.phone }} addresses={addresses} /></div>
}
