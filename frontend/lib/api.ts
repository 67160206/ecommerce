import { cookies } from 'next/headers'
const BASE = process.env.BACKEND_URL || 'http://localhost:3001'
// เรียก backend จากฝั่งเซิร์ฟเวอร์ของ Next.js พร้อมส่งต่อ cookie ของผู้ใช้
export async function call(method: string, path: string, body?: unknown) {
  try {
    const res = await fetch(BASE + '/api' + path, { method, cache: 'no-store', headers: { 'Content-Type': 'application/json', cookie: cookies().toString() }, body: body === undefined ? undefined : JSON.stringify(body) })
    return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
  } catch { return { ok: false, status: 0, data: {} } }
}
export async function get<T>(path: string): Promise<T | null> { const r = await call('GET', path); return r.ok ? (r.data as T) : null }
