"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config/index'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)

  console.log('Rendering ProductCard for:', product)

  // Check if product is in wishlist when component mounts or user changes
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get(`${apiurl}/wishlist/check/${product._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setIsWishlisted(response.data.data.inWishlist)
        } catch (error) {
          console.error('Error checking wishlist status:', error)
        }
      }
    }

    checkWishlistStatus()
  }, [product._id])

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please sign in to add items to your wishlist')
      return
    }

    setWishlistLoading(true)
    try {
      if (isWishlisted) {
        await axios.delete(`${apiurl}/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Removed from wishlist')
      } else {
        
        await axios.post(`${apiurl}/wishlist/${product._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Added to wishlist')
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error(error.response?.data?.message || 'Failed to update wishlist')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart')
      return
    }

    setCartLoading(true)
    try {
      await axios.post(`${apiurl}/cart`, {
        product_id: product._id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      toast.success('Added to cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error.response?.data?.message || 'Failed to add to cart')
    } finally {
      setCartLoading(false)
    }
  }

  return (
    <Card className="group overflow-h_idden">
      <div className="relative aspect-square overflow-h_idden">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-w_idth: 768px) 100vw, (max-w_idth: 1200px) 50vw, 33vw"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlistLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          )}
        </Button>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <Badge variant="destructive">Low Stock</Badge>
          )}
          {product.stock_quantity === 0 && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={product.stock_quantity === 0 || cartLoading}
          onClick={handleAddToCart}
        >
          {cartLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}