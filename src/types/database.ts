export type UserRole = 'Customer' | 'Admin'
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipping' | 'Completed' | 'Cancelled'
export type PaymentMethod = 'COD' | 'BankTransfer'
export type PaymentStatus = 'Unpaid' | 'Paid'

export interface AppUser {
  Id: string
  Email: string
  FullName: string | null
  Phone: string | null
  Role: UserRole
  CreatedAt: string
}

export interface Product {
  Id: string
  Name: string
  Slug: string
  Description: string | null
  FullDescription: string | null
  Category: string | null
  IsActive: boolean
  Images: string[] | null
  CreatedAt: string
  UpdatedAt: string
}

export interface ProductVariant {
  Id: string
  ProductId: string
  Name: string
  Price: number
  Stock: number
  CreatedAt: string
}

export interface Order {
  Id: string
  UserId: string | null
  Status: OrderStatus
  PaymentMethod: PaymentMethod
  PaymentStatus: PaymentStatus
  TotalAmount: number
  Note: string | null
  ShippingAddress: string | null
  CreatedAt: string
  UpdatedAt: string
}

export interface OrderItem {
  Id: string
  OrderId: string
  ProductId: string | null
  VariantId: string | null
  ProductName: string
  VariantName: string | null
  Quantity: number
  Price: number
}

export interface OrderStatusHistory {
  Id: string
  OrderId: string
  Status: OrderStatus
  Reason: string | null
  CreatedAt: string
}

export interface ContactMessage {
  Id: string
  Name: string
  Email: string | null
  Phone: string | null
  Message: string
  IsRead: boolean
  CreatedAt: string
}
