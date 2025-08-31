"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product, Category } from '@/lib/types'
import { Search } from 'lucide-react'
import { CategoriesResponse } from '../page'
import { ProductsResponse } from '@/lib/product'
import axios from 'axios'
import { apiurl } from '@/config'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductsResponse | null>(null)
  const [categories, setCategories] = useState<CategoriesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  
  const searchParams = useSearchParams()



  useEffect(() => {
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  const fetchAllProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get<ProductsResponse>(`${apiurl}/products`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch products')
      }
      const data: ProductsResponse = response.data
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get<CategoriesResponse>(`${apiurl}/categories`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch categories')
      }
      const data: CategoriesResponse = response.data
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories(null)
    }
  }

  const fetchSearchResults = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (searchQuery) params.q = searchQuery
      if (selectedCategory) params.category = selectedCategory
      const response = await axios.get<ProductsResponse>(`${apiurl}/products/search`, { params })
      if (response.status !== 200) {
        throw new Error('Failed to fetch search results')
      }
      const data: ProductsResponse = response.data
      setProducts(data)
    } catch (error) {
      console.error('Error fetching search results:', error)
      setProducts(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchSortedProducts = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (sortBy) params.sort = sortBy
      const response = await axios.get<ProductsResponse>(`${apiurl}/products/sort`, { params })
      if (response.status !== 200) {
        throw new Error('Failed to fetch sorted products')
      }
      const data: ProductsResponse = response.data
      setProducts(data)
    } catch (error) {
      console.error('Error fetching sorted products:', error)
      setProducts(null)
    } finally {
      setLoading(false)
    }
  }

  const getProductsByCategory = async ()=>{
    
    if (!selectedCategory) return
    setLoading(true)
    try {
      const response = await axios.get<ProductsResponse>(`${apiurl}/products/category/${selectedCategory}`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch products by category')
      }
      const data: ProductsResponse = response.data
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products by category:', error)
      setProducts(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery || sortBy) {
      fetchSearchResults()
    } else {
      fetchAllProducts()
    }
    if (!categories) {
      fetchCategories()
    }
    if (selectedCategory) {
      getProductsByCategory()
    }
    if (sortBy) {
      fetchSortedProducts()
    }
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {categories&&<Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories?.data.categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>}

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : products?.data&&products?.data.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.data.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
