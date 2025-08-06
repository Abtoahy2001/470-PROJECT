"use client"

import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { apiurl } from '@/config/index'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  // Add other product properties as needed
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${apiurl}/products?limit=4`)
        setProducts(response.data.data.products)
      } catch (err) {
        setError('Failed to fetch products. Please try again later.')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Demo categories - replace with real data from your API if needed
  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'accessories', name: 'Accessories' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to ShopHub
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing products at unbeatable prices. Shop from thousands of items across multiple categories.
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Shop Now</Link>
        </Button>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="p-6 border rounded-lg text-center hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}