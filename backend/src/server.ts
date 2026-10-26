import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient, User } from '@prisma/client'

const db = new PrismaClient()
const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'
const PORT = Number(process.env.PORT) || 3001
const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
class HttpError extends Error { constructor(public status: number, msg: string) { super(msg) } }
type Req = Request & { user: User | null }
const str = (v: unknown) => String(v ?? '').trim()
const app = express()
app.use(express.json())

// อ่านผู้ใช้จาก cookie JWT ทุกคำขอ
app.use(async (q, _r, n) => {
  const req = q as Req
  req.user = null
  const m = (q.headers.cookie || '').match(/(?:^|; )tok=([^;]+)/)
  if (m) try { const p = jwt.verify(m[1], SECRET) as { id: number }; req.user = await db.user.findUnique({ where: { id: p.id } }) } catch {}
  n()
})
const guard = (admin = false) => (q: Request, _r: Response, n: NextFunction) => {
  const u = (q as Req).user
  if (!u) throw new HttpError(401, 'กรุณาเข้าสู่ระบบ')
  if (admin && u.role !== 'ADMIN') throw new HttpError(403, 'ไม่มีสิทธิ์ใช้งานส่วนนี้')
  n()
}
const h = (f: (q: Req, r: Response) => unknown) => async (q: Request, r: Response) => {
  try { const x = await f(q as Req, r); if (x !== undefined) r.json(x) }
  catch (e) {
    const s = e instanceof HttpError ? e.status : 500
    if (s === 500) console.error(e)
    r.status(s).json({ error: s === 500 ? 'เกิดข้อผิดพลาดภายในระบบ' : (e as Error).message })
  }
}
const me = (q: Req) => q.user as User
const setTok = (r: Response, id: number) => r.cookie('tok', jwt.sign({ id }, SECRET, { expiresIn: '7d' }), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 6048e5 })
const safe = (u: User | null) => u && { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role }

app.get('/api/health', (_q, r) => { r.json({ ok: true }) })

// ---------- Auth ----------
app.post('/api/auth/register', h(async (q, r) => {
  const name = str(q.body.name), email = str(q.body.email).toLowerCase(), pw = String(q.body.password ?? '')
  if (!name || !/^\S+@\S+$/.test(email) || pw.length < 6) throw new HttpError(400, 'กรอกชื่อ อีเมลที่ถูกต้อง และรหัสผ่านอย่างน้อย 6 ตัวอักษร')
  if (await db.user.findUnique({ where: { email } })) throw new HttpError(409, 'อีเมลนี้ถูกใช้แล้ว')
  const u = await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(pw, 10) } })
  setTok(r, u.id)
  return { ok: true }
}))
app.post('/api/auth/login', h(async (q, r) => {
  const u = await db.user.findUnique({ where: { email: str(q.body.email).toLowerCase() } })
  if (!u || !(await bcrypt.compare(String(q.body.password ?? ''), u.passwordHash))) throw new HttpError(401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
  setTok(r, u.id)
  return { ok: true }
}))
app.post('/api/auth/logout', (q, r) => { r.clearCookie('tok', { path: '/' }); if (q.is('json')) r.json({ ok: true }); else r.redirect(303, '/') })
app.get('/api/me', h(q => ({ user: safe(q.user) })))
app.put('/api/profile', guard(), h(async q => { await db.user.update({ where: { id: me(q).id }, data: { name: str(q.body.name) || me(q).name, phone: str(q.body.phone) } }); return { ok: true } }))

// ---------- Addresses ----------
app.get('/api/addresses', guard(), h(q => db.address.findMany({ where: { userId: me(q).id }, orderBy: { id: 'asc' } })))
app.post('/api/addresses', guard(), h(async q => {
  const u = me(q), b = q.body, id = Number(b.id) || 0
  const d = { fullName: str(b.fullName), phone: str(b.phone), line1: str(b.line1), district: str(b.district), province: str(b.province), postalCode: str(b.postalCode), isDefault: !!b.isDefault }
  if (!d.fullName || !d.line1) throw new HttpError(400, 'กรอกชื่อผู้รับและที่อยู่')
  if (d.isDefault) await db.address.updateMany({ where: { userId: u.id }, data: { isDefault: false } })
  if (id) await db.address.updateMany({ where: { id, userId: u.id }, data: d })
  else await db.address.create({ data: { ...d, userId: u.id } })
  return { ok: true }
}))
app.delete('/api/addresses/:id', guard(), h(async q => { await db.address.deleteMany({ where: { id: Number(q.params.id), userId: me(q).id } }); return { ok: true } }))

// ---------- Catalog ----------
app.get('/api/categories', h(() => db.category.findMany({ orderBy: { id: 'asc' } })))
app.get('/api/products', h(q => {
  const c = Number(q.query.category) || 0, all = q.user?.role === 'ADMIN' && q.query.all === '1'
  return db.product.findMany({ where: { ...(all ? {} : { isActive: true }), name: { contains: str(q.query.q) }, ...(c ? { categoryId: c } : {}) }, include: { category: true }, orderBy: { id: 'asc' } })
}))
app.get('/api/products/:id', h(async q => {
  const p = await db.product.findUnique({ where: { id: Number(q.params.id) }, include: { category: true } })
  if (!p || (!p.isActive && q.user?.role !== 'ADMIN')) throw new HttpError(404, 'ไม่พบสินค้า')
  return p
}))

// ---------- Inventory (admin) ----------
const pd = (b: Record<string, unknown>) => {
  const d = { name: str(b.name), description: str(b.description), price: Number(b.price), stock: Math.max(0, Number(b.stock) | 0), lowStockThreshold: Math.max(0, Number(b.low) | 0), imageUrl: str(b.imageUrl) || '💊', categoryId: Number(b.categoryId), isActive: !!b.isActive }
  if (!d.name || !(d.price > 0) || !d.categoryId) throw new HttpError(400, 'กรอกชื่อสินค้า ราคา และหมวดหมู่ให้ครบ')
  return d
}
app.post('/api/products', guard(true), h(async q => { await db.product.create({ data: pd(q.body) }); return { ok: true } }))
app.put('/api/products/:id', guard(true), h(async q => { await db.product.update({ where: { id: Number(q.params.id) }, data: pd(q.body) }); return { ok: true } }))
app.delete('/api/products/:id', guard(true), h(async q => {
  const id = Number(q.params.id)
  if (await db.orderItem.count({ where: { productId: id } })) await db.product.update({ where: { id }, data: { isActive: false } })
  else await db.product.delete({ where: { id } })
  return { ok: true }
}))

// ---------- Orders ----------
app.get('/api/orders', guard(), h(q => {
  const u = me(q), st = str(q.query.status)
  return db.order.findMany({ where: { ...(u.role === 'ADMIN' ? {} : { userId: u.id }), ...(STATUSES.includes(st) ? { status: st } : {}) }, orderBy: { id: 'desc' } })
}))
app.get('/api/orders/:id', guard(), h(async q => {
  const u = me(q)
  const o = await db.order.findUnique({ where: { id: Number(q.params.id) }, include: { items: { include: { product: { include: { category: true } } } } } })
  if (!o || (o.userId !== u.id && u.role !== 'ADMIN')) throw new HttpError(404, 'ไม่พบคำสั่งซื้อ')
  return o
}))
app.post('/api/orders', guard(), h(async q => {
  const u = me(q), items: { id: number; qty: number }[] = Array.isArray(q.body.items) ? q.body.items : []
  const name = str(q.body.name), phone = str(q.body.phone), addr = str(q.body.address)
  if (!items.length || !name || !phone || !addr) throw new HttpError(400, 'กรอกข้อมูลจัดส่งให้ครบและเลือกสินค้าอย่างน้อย 1 รายการ')
  const order = await db.$transaction(async tx => {
    let total = 0
    const lines: { productId: number; quantity: number; unitPrice: number }[] = []
    for (const i of items) {
      const p = await tx.product.findUnique({ where: { id: Number(i.id) } }), n = Math.floor(Number(i.qty))
      if (!p || !p.isActive || !(n > 0)) throw new HttpError(400, 'มีสินค้าที่ไม่พร้อมขาย')
      const r = await tx.product.updateMany({ where: { id: p.id, stock: { gte: n } }, data: { stock: { decrement: n } } })
      if (!r.count) throw new HttpError(409, `“${p.name}” มีสต็อกไม่พอ`)
      total += p.price * n
      lines.push({ productId: p.id, quantity: n, unitPrice: p.price })
    }
    return tx.order.create({ data: { userId: u.id, totalAmount: total, shippingName: name, shippingPhone: phone, shippingAddress: addr, items: { create: lines } } })
  })
  return { id: order.id }
}))
app.post('/api/orders/:id/pay', guard(), h(async q => {
  const r = await db.order.updateMany({ where: { id: Number(q.params.id), userId: me(q).id, status: 'PENDING' }, data: { status: 'PAID' } })
  if (!r.count) throw new HttpError(400, 'คำสั่งซื้อนี้ชำระเงินไม่ได้')
  return { ok: true }
}))
app.put('/api/orders/:id/status', guard(true), h(async q => {
  const id = Number(q.params.id), status = str(q.body.status)
  if (!STATUSES.includes(status)) throw new HttpError(400, 'สถานะไม่ถูกต้อง')
  await db.$transaction(async tx => {
    const o = await tx.order.findUnique({ where: { id }, include: { items: true } })
    if (!o) throw new HttpError(404, 'ไม่พบออเดอร์')
    if (status === 'CANCELLED' && o.status !== 'CANCELLED')
      for (const i of o.items) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.quantity } } })
    if (o.status === 'CANCELLED' && status !== 'CANCELLED')
      for (const i of o.items) {
        const r = await tx.product.updateMany({ where: { id: i.productId, stock: { gte: i.quantity } }, data: { stock: { decrement: i.quantity } } })
        if (!r.count) throw new HttpError(409, 'สต็อกไม่พอสำหรับเปิดออเดอร์ใหม่')
      }
    await tx.order.update({ where: { id }, data: { status } })
  })
  return { ok: true }
}))

// ---------- Dashboard (admin) ----------
app.get('/api/dashboard', guard(true), h(async () => {
  const [orders, products] = await Promise.all([db.order.findMany({ orderBy: { id: 'desc' } }), db.product.findMany({ where: { isActive: true }, include: { category: true } })])
  const ok = orders.filter(o => o.status !== 'CANCELLED'), day = (d: Date) => d.toISOString().slice(0, 10)
  return {
    revenue: ok.reduce((a, o) => a + o.totalAmount, 0), orders: orders.length,
    pending: orders.filter(o => ['PENDING', 'PAID'].includes(o.status)).length,
    low: products.filter(p => p.stock <= p.lowStockThreshold),
    daily: [...Array(7)].map((_, i) => { const d = day(new Date(Date.now() - (6 - i) * 864e5)); return { date: d.slice(5), revenue: ok.filter(o => day(o.createdAt) === d).reduce((a, o) => a + o.totalAmount, 0) } }),
    recent: orders.slice(0, 6),
  }
}))

app.use((e: Error, _q: Request, r: Response, _n: NextFunction) => {
  const s = e instanceof HttpError ? e.status : 500
  r.status(s).json({ error: s === 500 ? 'เกิดข้อผิดพลาดภายในระบบ' : e.message })
})
app.listen(PORT, '0.0.0.0', () => console.log('Flow Lab API on :' + PORT))
