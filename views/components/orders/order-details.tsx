"use client"

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { Order } from '@/lib/types'

interface OrderDetailsProps {
  order: Order
  onCancelOrder?: (orderId: string) => void
}

export function OrderDetails({ order, onCancelOrder }: OrderDetailsProps) {
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

  const handleCancelOrder = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id)
    }
  }

  const canCancelOrder = !['cancelled', 'shipped', 'delivered'].includes(order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-muted-foreground">Order #{order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Status</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  {canCancelOrder && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancelOrder}
                      className="text-destructive hover:text-destructive"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                Order placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
              </p>
              {order.status === 'shipped' && (
                <p className="text-sm text-green-600">
                  Your order has been shipped and will arrive soon.
                </p>
              )}
              {order.status === 'delivered' && (
                <p className="text-sm text-green-600">
                  Your order was delivered on {format(new Date(order.updated_at), 'MMMM d, yyyy')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.products?.image_url || "/placeholder.svg"}
                        alt={item.products?.name || "Product image"}
                        fill
                        className="rounded-md object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.products?.name}</h4>
                      {item.products?.description && (
                        <p className="text-muted-foreground text-sm line-clamp-1">
                          {item.products.description}
                        </p>
                      )}
                      <p className="text-muted-foreground text-sm mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({order.order_items?.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && (
                  <p>{order.shipping_address.address_line_2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
              {order.status === 'shipped' && (
                <div className="pt-4 mt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Tracking Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Carrier: Standard Shipping
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: {format(new Date(order.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}