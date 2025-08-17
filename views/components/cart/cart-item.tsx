"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import type { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
  onQuantityChange?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.products.stock_quantity) return
    
    setQuantity(newQuantity)
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Link href={`/products/${item.product_id}`}>
            <Image
              src={item.products?.image_url || "/placeholder.svg"}
              alt={item.products?.name || "Product image"}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          </Link>
          
          <div className="flex-1">
            <Link 
              href={`/products/${item.product_id}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {item.products?.name}
            </Link>
            <p className="text-muted-foreground text-sm mt-1">
              ${item.price_at_addition.toFixed(2)} each
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= (item.products?.stock_quantity || 0)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-semibold">
              ${(item.price_at_addition * quantity).toFixed(2)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}