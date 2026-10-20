'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { call } from '@/lib/api'
const s = (f: FormData, k: string) => String(f.get(k) ?? '').trim()
const id = (f: FormData) => Number(f.get('id'))

export async function saveProfile(f: FormData) { await call('PUT', '/profile', { name: s(f, 'name'), phone: s(f, 'phone') }); revalidatePath('/account/profile') }
export async function saveAddress(f: FormData) {
  await call('POST', '/addresses', { id: id(f) || 0, fullName: s(f, 'fullName'), phone: s(f, 'phone'), line1: s(f, 'line1'), district: s(f, 'district'), province: s(f, 'province'), postalCode: s(f, 'postalCode'), isDefault: f.get('isDefault') === 'on' })
  revalidatePath('/account/profile')
}
export async function deleteAddress(f: FormData) { await call('DELETE', '/addresses/' + id(f)); revalidatePath('/account/profile') }
export async function payOrder(f: FormData) { await call('POST', `/orders/${id(f)}/pay`); revalidatePath('/order/' + id(f)) }
export async function setOrderStatus(f: FormData) { await call('PUT', `/orders/${id(f)}/status`, { status: s(f, 'status') }); revalidatePath('/admin/orders'); revalidatePath('/admin/orders/' + id(f)) }
export async function saveProduct(f: FormData) {
  const pid = s(f, 'id'), isNew = pid === 'new'
  const r = await call(isNew ? 'POST' : 'PUT', isNew ? '/products' : '/products/' + Number(pid), { name: s(f, 'name'), categoryId: Number(f.get('categoryId')), price: Number(f.get('price')), stock: Number(f.get('stock')), low: Number(f.get('low')), imageUrl: s(f, 'imageUrl'), description: s(f, 'description'), isActive: f.get('isActive') === 'on' })
  if (!r.ok) return
  revalidatePath('/', 'layout')
  redirect('/admin/products')
}
export async function deleteProduct(f: FormData) { await call('DELETE', '/products/' + id(f)); revalidatePath('/', 'layout') }
