"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config'

interface CartItem {
  product_id: string | {
    _id: string
    name: string
    price: number
    image_url: string
  }
  quantity: number
  price_at_addition: number
}

interface Cart {
  _id: string
  user_id: string
  items: CartItem[]
  total: number
  created_at: string
}

interface User {
  _id: string
  fullname: string
  email: string
  shipping_address?: {
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

interface ShippingInfo {
  full_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh'
  })
  const [paymentMethod, setPaymentMethod] = useState('credit_card')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        
        const userResponse = await axios.get(`${apiurl}/users/me`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setUser(userResponse.data.data.user)
        
        const cartResponse = await axios.get(`${apiurl}/cart`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setCart(cartResponse.data.data.cart)

        
        if (userResponse.data.data.user.shipping_address) {
          setShippingInfo({
            full_name: userResponse.data.data.user.fullname,
            address_line_1: userResponse.data.data.user.shipping_address.address_line_1,
            address_line_2: userResponse.data.data.user.shipping_address.address_line_2 || '',
            city: userResponse.data.data.user.shipping_address.city,
            state: userResponse.data.data.user.shipping_address.state,
            postal_code: userResponse.data.data.user.shipping_address.postal_code,
            country: userResponse.data.data.user.shipping_address.country || 'United States'
          })
        } else {
          // At least set the full name from user profile
          setShippingInfo(prev => ({
            ...prev,
            full_name: userResponse.data.data.user.fullname
          }))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load checkout data')
        router.push('/cart')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Prepare order data
      const orderData = {
        items: cart?.items.map(item => ({
          product_id: typeof item.product_id === 'object' ? item.product_id._id : item.product_id,
          quantity: item.quantity,
          price_at_purchase: typeof item.product_id === 'object' 
            ? item.product_id.price 
            : item.price_at_addition
        })),
        subtotal: cart?.total || 0,
        shipping_fee: 0, // Free shipping in this example
        tax: 0, // No tax in this example
        total: cart?.total || 0,
        shipping_address: `${shippingInfo.address_line_1}, ${shippingInfo.address_line_2 ? shippingInfo.address_line_2 + ', ' : ''}${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postal_code}, ${shippingInfo.country}`,
        payment_method: paymentMethod,
        full_name: shippingInfo.full_name
      }

      
      const response = await axios.post(`${apiurl}/orders`, orderData,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      
      await axios.delete(`${apiurl}/cart/clear`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      toast.success('Order placed successfully!', {
        description: `Order #${response.data.data.order._id} has been created.`
      })

      // Redirect to order confirmation
      router.push(`/orders`)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order', {
        description: error.response?.data?.message || 'Please try again or contact support.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart')
    return null
  }

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (typeof item.product_id === 'object' 
      ? item.product_id.price * item.quantity 
      : item.price_at_addition * item.quantity
    ), 0
  )
  const shippingFee = 0 // Free shipping in this example
  const tax = 0 // No tax in this example
  const total = subtotal + shippingFee + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={shippingInfo.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address_line_1">Address Line 1</Label>
                  <Input
                    id="address_line_1"
                    name="address_line_1"
                    value={shippingInfo.address_line_1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address_line_2"
                    name="address_line_2"
                    value={shippingInfo.address_line_2}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={shippingInfo.postal_code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Payment Method</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      id="cod"
                      name="cod"
                      type="radio"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="cash_on_delivery">Cash On Delivery</Label>
                  </div>
                  
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.items.map((item) => {
              const product = typeof item.product_id === 'object' 
                ? item.product_id 
                : { _id: item.product_id, name: 'Product', price: item.price_at_addition }
              
              return (
                <div key={product._id} className="flex justify-between">
                  <span>{product.name} × {item.quantity}</span>
                  <span>${(product.price * item.quantity).toFixed(2)}</span>
                </div>
              )
            })}
            <Separator />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}