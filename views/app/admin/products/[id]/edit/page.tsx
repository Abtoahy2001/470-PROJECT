import { notFound } from "next/navigation"
import axios from "axios"
import { apiurl } from "@/config"
import { EditProductForm } from "@/components/admin/products/edit-product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  try {
    const productResponse = await axios.get(`${apiurl}/products/${params.id}`)
    const product = productResponse.data.data.product
    const categoriesResponse = await axios.get(`${apiurl}/categories`, {
      params: { is_active: true }
    })
    const categories = categoriesResponse.data.data.categories

    if (!product) {
      notFound()
    }

    return <EditProductForm product={product} categories={categories} />
  } catch (error) {
    notFound()
  }
}