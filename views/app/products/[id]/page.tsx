import { ProductDetails } from '@/components/products/product-details'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    id: string
  }
}

// Mock data for demonstration
const mockProducts = [
  {
    id: 'prod_1',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with our premium noise-cancelling wireless headphones. Features 30-hour battery life and comfortable over-ear design.',
    price: 199.99,
    stock_quantity: 15,
    is_active: true,
    image_url: '/placeholder.svg',
    categories: { name: 'Electronics' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod_2',
    name: 'Organic Cotton T-Shirt',
    description: '100% organic cotton t-shirt with comfortable fit and durable construction. Available in multiple colors.',
    price: 29.99,
    stock_quantity: 42,
    is_active: true,
    image_url: '/placeholder.svg',
    categories: { name: 'Clothing' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockRelatedProducts = [
  {
    id: 'prod_3',
    name: 'Wireless Earbuds',
    description: 'Compact wireless earbuds with premium sound quality and 8-hour battery life.',
    price: 89.99,
    stock_quantity: 25,
    is_active: true,
    image_url: '/placeholder.svg',
    categories: { name: 'Electronics' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod_4',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 20W output and waterproof design.',
    price: 59.99,
    stock_quantity: 18,
    is_active: true,
    image_url: '/placeholder.svg',
    categories: { name: 'Electronics' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default async function ProductPage({ params }: ProductPageProps) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Find product in mock data
  const product = mockProducts.find(p => p.id === params.id)
  const relatedProducts = mockRelatedProducts

  if (!product) {
    notFound()
  }

  return (
    <ProductDetails
      product={product} 
      relatedProducts={relatedProducts} 
    />
  )
}