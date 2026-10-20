export type User = { id: number; name: string; email: string; phone: string; role: string }
export type Category = { id: number; name: string; slug: string }
export type Product = { id: number; name: string; description: string; price: number; imageUrl: string; stock: number; lowStockThreshold: number; isActive: boolean; categoryId: number; category: Category }
export type Address = { id: number; fullName: string; phone: string; line1: string; district: string; province: string; postalCode: string; isDefault: boolean }
export type OrderRow = { id: number; userId: number; status: string; totalAmount: number; shippingName: string; shippingPhone: string; shippingAddress: string; createdAt: string }
export type Order = OrderRow & { items: { id: number; productId: number; quantity: number; unitPrice: number; product: Product }[] }
