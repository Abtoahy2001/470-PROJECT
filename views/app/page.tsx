"use client"

import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { apiurl } from '@/config/index'
import Image from 'next/image'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface CategoriesResponse {
  status: string
  results: number
  data: Data
}

export interface Data {
  categories: Category[]
}

export interface Category {
  _id: string
  name: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  __v: number
}


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoriesResponse | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${apiurl}/products?limit=4`)
        const categoriesResponse = await axios.get<CategoriesResponse>(`${apiurl}/categories`)
        setCategories(categoriesResponse.data)
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

  

  return (
    <div className="container mx-auto px-4 py-8">
     
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

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories?.data.categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category._id}`}
              className="p-6 border rounded-lg text-center hover:shadow-md transition-shadow"
            >
              <Image src={category.image_url} height={200} width={200} className='w-full object-cover rounded-md' alt={category.name}/>
              <h3 className="font-semibold mt-2">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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