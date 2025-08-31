"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>
              Manage your product catalog, add new products, and update inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/products">Manage Products</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/admin/products/new">Add New Product</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              View and manage customer orders, update order status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
            <CardDescription>
              Manage your product categories, add new categories, and update existing ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/categories">Manage Categories</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/admin/categories/new">Add New Category</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}