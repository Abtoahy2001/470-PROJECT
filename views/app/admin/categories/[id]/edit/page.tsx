import { EditCategoryForm } from "@/components/admin/categories/edit-category-form"
import { notFound } from "next/navigation"
import axios from "axios"
import { apiurl } from "@/config"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  try {
    const response = await axios.get(`${apiurl}/categories/${params.id}`)
    const category = response.data.data.category

    if (!category) {
      notFound()
    }

    return <EditCategoryForm category={category} />
  } catch (error) {
    notFound()
  }
}