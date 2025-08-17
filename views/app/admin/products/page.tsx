"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Search, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    description: 'Noise-cancelling wireless headphones with 30hr battery life',
    price: 199.99,
    stock_quantity: 25,
    is_active: true,
    image_url: '/placeholder.svg',
    categories: { name: 'Electronics' },
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    description: '100% organic cotton, unisex fit',
    price: 29.99,
    stock_quantity: 0,
    is_active: false,
    image_url: '/placeholder.svg',
    categories: { name: 'Clothing' },
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Wireless Charger',
    description: 'Fast charging wireless pad for all devices',
    price: 39.99,
    stock_quantity: 15,
    is_active: true,
    image_url: '/placeholder.svg',
    categories: { name: 'Electronics' },
    created_at: new Date().toISOString()
  }
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProducts = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter mock data based on search query
      const filteredProducts = mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products', {
        description: "There was an error while fetching the products. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setProducts(prev => prev.filter(product => product.id !== productId))
      
      toast.success('Product deleted successfully', {
        description: "The product has been removed from your inventory."
      })
    } catch (error) {
      toast.error('Failed to delete product', {
        description: "There was an error while deleting the product. Please try again."
      })
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, is_active: !currentStatus } 
          : product
      ))
      
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`, {
        description: `The product status has been updated to ${!currentStatus ? 'active' : 'inactive'}.`
      })
    } catch (error) {
      toast.error('Failed to update product status', {
        description: "There was an error while updating the product status. Please try again."
      })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle>Products</CardTitle>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description?.slice(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.categories?.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock_quantity > 0 ? "secondary" : "destructive"}>
                        {product.stock_quantity} in stock
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleProductStatus(product.id, product.is_active)}
                          >
                            {product.is_active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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