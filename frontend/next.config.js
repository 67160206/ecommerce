const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001'
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  // ส่งทุกคำขอ /api/* ไปยัง backend (cookie ผ่านได้เพราะอยู่ origin เดียวกับหน้าเว็บ)
  async rewrites() { return [{ source: '/api/:path*', destination: BACKEND + '/api/:path*' }] },
}
