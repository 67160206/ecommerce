import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...a: ClassValue[]) => twMerge(clsx(a))
export const baht = (n: number) => '฿' + n.toLocaleString('th-TH')
export const STATUS: Record<string, string> = { PENDING: 'รอชำระ', PAID: 'ชำระแล้ว', SHIPPED: 'จัดส่งแล้ว', DELIVERED: 'ส่งมอบแล้ว', CANCELLED: 'ยกเลิก' }
