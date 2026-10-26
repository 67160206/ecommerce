import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const db = new PrismaClient()
const S: [string, number, number, number, string][] = [['วิตามินซี 1000 มก.',0,289,40,'🍊'],['วิตามินดี3 5000 IU',0,350,25,'☀️'],['วิตามินบีรวม',0,320,30,'💊'],['วิตามินอี 400 IU',0,260,3,'🌻'],['มัลติวิตามินรายวัน',0,590,50,'🌈'],['แคลเซียม + แมกนีเซียม',1,420,18,'🦴'],['ซิงค์ 15 มก.',1,230,35,'🛡️'],['ธาตุเหล็กชนิดอ่อนโยน',1,310,4,'🩸'],['แมกนีเซียมกลีไซเนต',1,480,22,'🌙'],['น้ำมันปลา 1000 มก.',2,550,45,'🐟'],['โอเมก้า-3 ความเข้มข้นสูง',2,890,15,'🌊'],['น้ำมันตับปลาคอด',2,390,0,'🧴'],['เวย์โปรตีน ช็อกโกแลต',3,1450,12,'🍫'],['โปรตีนจากพืช วานิลลา',3,1290,9,'🌱'],['คอลลาเจนไตเปปไทด์',3,990,28,'✨'],['ขมิ้นชันสกัด',4,270,33,'🟡'],['กระชายขาวแคปซูล',4,240,5,'🌿'],['ใบบัวบกสกัด',4,210,40,'🍃']]
const img = (i: number) => `/products/p${String(i + 1).padStart(2, '0')}.svg`
// ฐานข้อมูลเดิมที่ใช้อีโมจิ: ใส่รูปให้อัตโนมัติ (ไม่แตะสินค้าที่แอดมินตั้งรูปเองแล้ว)
async function backfillImages() {
  for (let i = 0; i < S.length; i++)
    await db.product.updateMany({ where: { name: S[i][0], NOT: [{ imageUrl: { startsWith: '/' } }, { imageUrl: { startsWith: 'http' } }] }, data: { imageUrl: img(i) } })
}
async function main() {
  if (await db.user.count()) return backfillImages()
  const names = ['วิตามิน','แร่ธาตุ','โอเมก้า / น้ำมันปลา','โปรตีน','สมุนไพร']
  const ids: number[] = []
  for (let i = 0; i < names.length; i++) ids.push((await db.category.create({ data: { name: names[i], slug: 'cat-' + i } })).id)
  for (let i = 0; i < S.length; i++) await db.product.create({ data: { name: S[i][0], categoryId: ids[S[i][1]], price: S[i][2], stock: S[i][3], imageUrl: img(i), description: 'อาหารเสริมคุณภาพ คัดสรรวัตถุดิบมาตรฐาน GMP รับประทานตามฉลาก ไม่ใช่ยา' } })
  await db.user.create({ data: { name: 'ผู้ดูแลระบบ', email: 'admin@shop.test', passwordHash: await bcrypt.hash('admin123', 10), role: 'ADMIN' } })
  await db.user.create({ data: { name: 'สมชาย ใจดี', email: 'user@shop.test', passwordHash: await bcrypt.hash('user123', 10), phone: '0812345678',
    addresses: { create: { fullName: 'สมชาย ใจดี', phone: '0812345678', line1: '99 ถ.สุขุมวิท', district: 'วัฒนา', province: 'กรุงเทพฯ', postalCode: '10110', isDefault: true } } } })
}
main().finally(() => db.$disconnect())
