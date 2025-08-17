import { OrderDetails } from '@/components/orders/order-details'
import { notFound } from 'next/navigation'

interface OrderPageProps {
  params: {
    id: string
  }
}

// Mock order data
const mockOrders = [
  {
    id: 'order_1',
    user_id: 'user_1',
    total_amount: 299.97,
    status: 'processing',
    shipping_address: {
      full_name: 'John Doe',
      address_line_1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'United States'
    },
    created_at: new Date().toISOString(),
    order_items: [
      {
        id: 'item_1',
        product_id: 'prod_1',
        quantity: 2,
        price: 129.99,
        products: {
          id: 'prod_1',
          name: 'Wireless Headphones',
          image_url: '/placeholder.svg',
          description: 'Premium noise-cancelling headphones'
        }
      },
      {
        id: 'item_2',
        product_id: 'prod_2',
        quantity: 1,
        price: 39.99,
        products: {
          id: 'prod_2',
          name: 'USB-C Cable',
          image_url: '/placeholder.svg',
          description: 'High-speed charging cable'
        }
      }
    ]
  }
]

export default async function OrderPage({ params }: OrderPageProps) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Find mock order
  const order = mockOrders.find(o => o.id === params.id)
  
  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}