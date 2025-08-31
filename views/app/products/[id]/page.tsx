"use client"

import { useEffect, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ShoppingCart, Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config'
import { format } from 'date-fns'

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  category_id: string
  categories?: Category
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ProductDetails() {
  const router = useRouter()
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false)
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const productResponse = await axios.get(`${apiurl}/products/${id}`)
        setProduct(productResponse.data.data.product)
        if (productResponse.data.data.product?.category_id) {
          const relatedResponse = await axios.get(`${apiurl}/products`, {
            params: {
              category: productResponse.data.data.product.category_id,
              limit: 4,
              exclude: id
            }
          })
          setRelatedProducts(relatedResponse.data.data.products)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id])

    useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get(`${apiurl}/wishlist/check/${product?._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setIsWishlisted(response.data.data.inWishlist)
        } catch (error) {
          console.error('Error checking wishlist status:', error)
        }
      }
    }

    checkWishlistStatus()
  }, [product?._id])

  const handleAddToCart = async () => {
    const response = await axios.post(`${apiurl}/cart/add`, {
      productId: product?._id,
      quantity
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (response.status === 200) {
      toast.success(`${product?.name} added to cart`)
      router.push('/cart')
    } else {
      toast.error('Failed to add item to cart')
    }
  }

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please sign in to add items to your wishlist')
      return
    }

    setWishlistLoading(true)
    try {
      if (isWishlisted) {
        await axios.delete(`${apiurl}/wishlist/${product?._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Removed from wishlist')
      } else {
        
        await axios.post(`${apiurl}/wishlist/${product?._id}`, {}, {
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


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 bg-muted rounded"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-6 w-1/4 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-12 w-1/3 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.categories?.name || 'Uncategorized'}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-2">${product.price.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="flex items-center gap-2">
              <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {product.stock_quantity} available
              </span>
            </div>

            {product.stock_quantity > 0 && (
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, Number(e.target.value))))}
                    className="w-20"
                  />
                </div>
                <Button onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={handleToggleWishlist} disabled={wishlistLoading}>
                  {wishlistLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Heart className="h-4 w-4 mr-2" />}
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              <p>SKU: {product._id}</p>
              <p>Added: {format(new Date(product.created_at), 'MMMM d, yyyy')}</p>
              {product.updated_at && (
                <p>Last updated: {format(new Date(product.updated_at), 'MMMM d, yyyy')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-shadow">
                <Link href={`/products/${product._id}`}>
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.categories?.name}
                    </p>
                    <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}