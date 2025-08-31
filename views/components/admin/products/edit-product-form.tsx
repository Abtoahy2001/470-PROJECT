"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import axios from "axios"
import { apiurl } from "@/config"

interface Category {
  _id: string
  name: string
  is_active: boolean
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
}

interface EditProductFormProps {
  product: Product
  categories: Category[]
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock_quantity: product.stock_quantity.toString(),
    category_id: product.category_id,
    image_url: product.image_url,
    is_active: product.is_active,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required")
      return false
    }
    if (formData.name.length > 100) {
      toast.error("Product name cannot exceed 100 characters")
      return false
    }
    if (!formData.description.trim()) {
      toast.error("Description is required")
      return false
    }
    if (!formData.price || Number.parseFloat(formData.price) < 0) {
      toast.error("Valid price is required")
      return false
    }
    if (!formData.stock_quantity || Number.parseInt(formData.stock_quantity) < 0) {
      toast.error("Valid stock quantity is required")
      return false
    }
    if (!formData.category_id) {
      toast.error("Category is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Math.round(Number.parseFloat(formData.price) * 100) / 100,
        stock_quantity: Number.parseInt(formData.stock_quantity),
        category_id: formData.category_id,
        image_url: formData.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image",
        is_active: formData.is_active,
      }

      const response = await axios.patch(`${apiurl}/products/${product._id}`, productData)
      
      if (response.status === 200) {
        toast.success("Product updated successfully")
        router.push("/admin/products")
      } else {
        throw new Error(response.data.message || "Failed to update product")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Created {format(new Date(product.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  className="mt-2"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.name.length}/100 characters</p>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  className="mt-2"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                className="mt-2"
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleSelectChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="image_url">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-2"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active Product</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Inactive products won't be visible to customers</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}