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
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config'
import { OrderStatusSelect } from '@/components/admin/order/order-status-select'

interface Order {
  _id: string
  user_id: {
    _id: string
    email: string
    fullname: string
  }
  items: {
    product_id: {
      _id: string
      name: string
    }
    quantity: number
  }[]
  subtotal: number
  shipping_fee: number
  total: number
  shipping_address: string
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
}

interface OrdersResponse {
  status: string
  results: number
  data: {
    orders: Order[]
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)


  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get<OrdersResponse>(`${apiurl}/orders`,{
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      setOrders(response.data.data.orders)
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
      setUpdatingStatus(orderId)
      await axios.patch(`${apiurl}/orders/${orderId}/status`, {
        status: newStatus
      },
    {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
      
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, order_status: newStatus } 
          : order
      ))
      
      toast.success('Order status updated', {
        description: `Order status has been changed to ${newStatus}.`
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Update failed', {
        description: 'Failed to update order status. Please try again.'
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)
      await axios.patch(`${apiurl}/orders/${orderId}/payment-status`, {
        status: newStatus
      },
      {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, payment_status: newStatus } 
          : order
      ))
      toast.success('Payment status updated', {
        description: `Payment status has been changed to ${newStatus}.`
      })
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Update failed', {
        description: 'Failed to update payment status. Please try again.'
      })
    } finally {
      setUpdatingStatus(null)
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'completed': return 'default'
      case 'failed': return 'destructive'
      case 'refunded': return 'default'
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
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user_id.fullname}</div>
                        <div className="text-sm text-muted-foreground">

                          {order.user_id.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.order_status)}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(order.created_at))} ago
                    </TableCell>
                    <TableCell>
                      <OrderStatusSelect
                        currentStatus={order.order_status}
                        onStatusChange={(newStatus) => updateOrderStatus(order._id, newStatus)}
                        statuses={['processing', 'shipped', 'delivered', 'cancelled']}
                        isLoading={updatingStatus === order._id}
                      />
                    </TableCell>
                    <TableCell>
                      <OrderStatusSelect
                        currentStatus={order.order_status}
                        statuses={['pending', 'completed', 'failed', 'refunded']}
                        onStatusChange={(newStatus) => updatePaymentStatus(order._id, newStatus)}
                        isLoading={updatingStatus === order._id}
                      />
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