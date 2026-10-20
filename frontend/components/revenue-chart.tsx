'use client'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
export default function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" /><YAxis /><Tooltip />
    <Bar dataKey="revenue" name="รายได้ (฿)" fill="#16739f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
}
