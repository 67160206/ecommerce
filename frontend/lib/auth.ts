import { redirect } from 'next/navigation'
import { get } from './api'
import type { User } from './types'
export const getUser = async () => (await get<{ user: User | null }>('/me'))?.user ?? null
export async function requireUser(next = '/') {
  const u = await getUser()
  if (!u) redirect('/login?next=' + encodeURIComponent(next))
  return u
}
export async function requireAdmin() {
  const u = await requireUser('/admin')
  if (u.role !== 'ADMIN') redirect('/')
  return u
}
