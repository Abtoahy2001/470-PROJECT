"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config'

interface OrderItem {
  product_id: {
    _id: string
    name: string
    description?: string
    price: number
    image_url: string
  }
  quantity: number
  price_at_purchase: number
}

interface Order {
  _id: string
  user_id: {
    _id: string
    email: string
  }
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  total: number
  shipping_address: string
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
  __v: number
}

interface OrdersResponse {
  status: string
  results: number
  data: {
    orders: Order[]
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get<OrdersResponse>(`${apiurl}/orders`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setOrders(response.data.data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
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

  const parseShippingAddress = (addressString: string) => {
    // Simple parsing - adjust based on your actual address format
    const parts = addressString.split(', ')
    return {
      full_name: parts[0] || '',
      address_line_1: parts[1] || '',
      address_line_2: parts[2] || '',
      city: parts[3] || '',
      state: parts[4]?.split(' ')[0] || '',
      postal_code: parts[4]?.split(' ')[1] || '',
      country: parts[5] || ''
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
          {orders.map((order) => {
            const shippingAddress = parseShippingAddress(order.shipping_address)
            
            return (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <Badge variant={getStatusColor(order.order_status)}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
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
                          {order.items.map((item) => (
                            <div key={item.product_id._id} className="flex justify-between text-sm">
                              <span>{item.product_id.name} × {item.quantity}</span>
                              <span>${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{shippingAddress.full_name}</p>
                          <p>{shippingAddress.address_line_1}</p>
                          {shippingAddress.address_line_2 && (
                            <p>{shippingAddress.address_line_2}</p>
                          )}
                          <p>
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                          </p>
                          <p>{shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}