"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/components/cart/cart-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  description?: string
  price: number
  stock_quantity: number
  image_url: string
  category_id?: string
  is_active: boolean
}

interface CartItem {
  product_id: string | Product
  quantity: number
  price_at_addition: number
}

interface Cart {
  _id: string
  user_id: string
  items: CartItem[]
  total: number
  created_at: string
  updated_at: string
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiurl}/cart`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setCart(response.data.data.cart)
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to load your cart')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    try {
      setUpdating(true)
      await axios.delete(`${apiurl}/cart/remove/${productId}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Item removed from cart')
      fetchCart() 
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    } finally {
      setUpdating(false)
    }
  }

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    try {
      setUpdating(true)
      console.log("Updating quantity for product:", productId, "to", newQuantity)
      await axios.patch(`${apiurl}/cart/update`, {
        productId,
        quantity: newQuantity
      },{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
    } finally {
      setUpdating(false)
    }
  }

  const clearCart = async () => {
    try {
      setUpdating(true)
      await axios.delete(`${apiurl}/cart/clear`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Cart cleared')
      setCart(null)
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started!</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (typeof item.product_id === 'object' 
      ? item.product_id.price * item.quantity 
      : item.price_at_addition * item.quantity
    ), 0
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = typeof item.product_id === 'object' 
              ? item.product_id 
              : { _id: item.product_id } as Product
            
            return (
              <CartItem 
                key={product._id}
                item={{
                  _id: product._id,
                  product_id: product._id,
                  quantity: item.quantity,
                  price_at_addition: typeof item.product_id === 'object' 
                    ? item.product_id.price 
                    : item.price_at_addition,
                  products: {
                    _id: product._id,
                    name: typeof item.product_id === 'object' ? item.product_id.name : 'Product',
                    price: typeof item.product_id === 'object' ? item.product_id.price : item.price_at_addition,
                    image_url: typeof item.product_id === 'object' ? item.product_id.image_url : '/placeholder.svg',
                    stock_quantity: typeof item.product_id === 'object' ? item.product_id.stock_quantity : 1,
                  }
                }}
                onRemove={removeItem}
                onQuantityChange={updateQuantity}
                disabled={updating}
              />
            )
          })}

          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={clearCart}
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Clear Cart
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => router.push('/checkout')}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}