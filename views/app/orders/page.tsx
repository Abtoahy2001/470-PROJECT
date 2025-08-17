"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Order } from '@/lib/types'

// Mock data
const mockOrders: Order[] = [
  {
    id: 'order_1',
    user_id: 'user_1',
    total_amount: 299.97,
    status: 'processing',
    shipping_address: {
      full_name: 'John Doe',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'United States'
    },
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    order_items: [
      {
        id: 'item_1',
        order_id: 'order_1',
        product_id: 'prod_1',
        quantity: 2,
        price: 129.99,
        products: {
          id: 'prod_1',
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling headphones',
          price: 129.99,
          image_url: '/placeholder.svg'
        }
      },
      {
        id: 'item_2',
        order_id: 'order_1',
        product_id: 'prod_2',
        quantity: 1,
        price: 39.99,
        products: {
          id: 'prod_2',
          name: 'USB-C Cable',
          description: 'High-speed charging cable',
          price: 39.99,
          image_url: '/placeholder.svg'
        }
      }
    ]
  },
  {
    id: 'order_2',
    user_id: 'user_1',
    total_amount: 89.98,
    status: 'delivered',
    shipping_address: {
      full_name: 'John Doe',
      address_line_1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'United States'
    },
    created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    order_items: [
      {
        id: 'item_3',
        order_id: 'order_2',
        product_id: 'prod_3',
        quantity: 1,
        price: 89.98,
        products: {
          id: 'prod_3',
          name: 'Smart Watch',
          description: 'Fitness tracking smartwatch',
          price: 89.98,
          image_url: '/placeholder.svg'
        }
      }
    ]
  }
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        setOrders(mockOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'processing': return 'default'
      case 'shipped': return 'default'
      case 'delivered': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Placed {formatDistanceToNow(new Date(order.created_at))} ago
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.products?.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shipping_address.full_name}</p>
                        <p>{order.shipping_address.address_line_1}</p>
                        {order.shipping_address.address_line_2 && (
                          <p>{order.shipping_address.address_line_2}</p>
                        )}
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-semibold">Total: ${order.total_amount.toFixed(2)}</span>
                    <Button variant="outline" asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}