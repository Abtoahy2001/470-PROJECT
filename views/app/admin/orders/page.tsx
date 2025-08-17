"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
 TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import type { Order } from '@/lib/types'

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ord_1',
    status: 'processing',
    total_amount: 129.99,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    profiles: {
      full_name: 'John Doe',
      email: 'john@example.com'
    },
    order_items: [
      { quantity: 1, products: { name: 'Wireless Headphones' } },
      { quantity: 2, products: { name: 'USB-C Cable' } }
    ]
  },
  {
    id: 'ord_2',
    status: 'shipped',
    total_amount: 59.99,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    profiles: {
      full_name: 'Jane Smith',
      email: 'jane@example.com'
    },
    order_items: [
      { quantity: 1, products: { name: 'Smart Watch' } }
    ]
  },
  {
    id: 'ord_3',
    status: 'delivered',
    total_amount: 299.99,
    created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    profiles: {
      full_name: 'Robert Johnson',
      email: 'robert@example.com'
    },
    order_items: [
      { quantity: 1, products: { name: 'Gaming Console' } },
      { quantity: 1, products: { name: 'Controller' } }
    ]
  }
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders', {
        description: 'There was an error fetching orders. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ))
      
      toast.success('Order status updated', {
        description: `Order status has been changed to ${newStatus}.`
      })
    } catch (error) {
      toast.error('Update failed', {
        description: 'Failed to update order status. Please try again.'
      })
    }
  }

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

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.profiles?.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.profiles?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.order_items?.length} items
                    </TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(order.created_at))} ago
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>View</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}