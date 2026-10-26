# Flow Lab – แยก Frontend / Backend คนละ container

    docker compose up --build
- เว็บ (frontend, Next.js):  http://localhost:8080
- API (backend, Express + Prisma + SQLite):  http://localhost:3001/api/health
- ตั้ง AUTH_SECRET=ค่าลับ ก่อนใช้งานจริง · ข้อมูลอยู่ใน volume `dbdata` ของ backend

บัญชีทดลอง: admin@shop.test / admin123 · user@shop.test / user123

## โครงสร้าง
- backend/   REST API ทั้งหมด (auth JWT cookie, สินค้า, ออเดอร์, แดชบอร์ด) + Prisma schema/seed
- frontend/  Next.js + Tailwind + Recharts เรียก backend ผ่าน
  - เบราว์เซอร์ → /api/* (Next rewrites ส่งต่อไป backend ทำให้ cookie อยู่ origin เดียวกัน)
  - เซิร์ฟเวอร์ Next.js → backend โดยตรง (BACKEND_URL=http://backend:3001) พร้อมส่งต่อ cookie

## Endpoint หลัก
GET /api/products?q=&category= · GET /api/products/:id · GET /api/categories · GET /api/health
POST /api/auth/login|register|logout · GET /api/me · PUT /api/profile · GET|POST /api/addresses · DELETE /api/addresses/:id
GET|POST /api/orders · GET /api/orders/:id · POST /api/orders/:id/pay
แอดมิน: POST|PUT|DELETE /api/products · PUT /api/orders/:id/status · GET /api/dashboard
