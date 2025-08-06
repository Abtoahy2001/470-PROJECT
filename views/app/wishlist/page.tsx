"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { apiurl } from '@/config/index'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    description: string
    price: number
    image_url: string
    // Add other product properties as needed
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setLoggedIn(!!token)
    
    if (token) {
      fetchWishlist(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchWishlist = async (token: string) => {
    try {
      const response = await axios.get(`${apiurl}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setWishlistItems(response.data.data.wishlist)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemovingId(productId)
      const token = localStorage.getItem('token')
      if (!token) return
      
      await axios.delete(`${apiurl}/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove item')
    } finally {
      setRemovingId(null)
    }
  }

  if (!loggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-8">You need to sign in to view your wishlist.</p>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save items you love to your wishlist!</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item.product} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromWishlist(item.product.id)}
                disabled={removingId === item.product.id}
              >
                {removingId === item.product.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}