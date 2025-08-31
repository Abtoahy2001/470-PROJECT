"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"
import { apiurl } from "@/config"
import { format } from "date-fns"

interface Category {
  _id: string
  name: string
  description?: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

interface EditCategoryFormProps {
  category: Category
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
    image_url: category.image_url === "invalid" ? "" : category.image_url || "",
    is_active: category.is_active,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
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
      toast.error("Category name is required")
      return false
    }
    if (formData.name.length > 50) {
      toast.error("Category name cannot exceed 50 characters")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image_url: formData.image_url || "invalid",
        is_active: formData.is_active,
      }

      const response = await axios.patch(`${apiurl}/categories/${category._id}`, categoryData)
      
      if (response.status === 200) {
        toast.success("Category updated successfully")
        router.push("/admin/categories")
      } else {
        throw new Error(response.data.message || "Failed to update category")
      }
    } catch (error: any) {
      if (error.response?.data?.code === 11000) {
        toast.error("A category with this name already exists")
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to update category")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground">
            Created {format(new Date(category.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  className="mt-2"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  maxLength={50}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.name.length}/50 characters • Must be unique
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="mt-2"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                className="mt-2"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg (optional)"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to use default placeholder</p>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active Category</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Inactive categories won't be visible to customers</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Category"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/categories">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}