export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  category_id: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Category {
  _id: string
  name: string
  description: string
  created_at: string
}

export interface CartItem {
  _id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  products: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: {
    full_name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  products: Product
}

export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}
