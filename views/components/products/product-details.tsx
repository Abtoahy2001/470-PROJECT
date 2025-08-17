"use client"

import Image from "next/image"
import { useState } from "react"
import { Heart, ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { toast } from "sonner"
import { format } from "date-fns"

interface ProductDetailsProps {
  product: Product
  relatedProducts?: Product[]
}

export function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock images for demonstration
  const productImages = [
    product.image_url || "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ]

  const getStockStatus = () => {
    if (product.stock_quantity === 0) return { text: "Out of Stock", color: "destructive" }
    if (product.stock_quantity <= 5) return { text: `Only ${product.stock_quantity} left`, color: "destructive" }
    if (product.stock_quantity <= 20) return { text: "Low Stock", color: "secondary" }
    return { text: "In Stock", color: "default" }
  }

  const stockStatus = getStockStatus()

  const handleAddToCart = () => {
    toast.success("Added to cart", {
      description: `${quantity} ${product.name}(s) added to your cart`,
    })
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-muted hover:border-muted-foreground"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.categories?.name || "Uncategorized"}</Badge>
              <Badge variant={stockStatus.color as any}>{stockStatus.text}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>SKU: {product.id.slice(0, 8).toUpperCase()}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Added {format(new Date(product.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">${product.price.toFixed(2)}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">(4.8) 124 reviews</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock_quantity} available</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg" onClick={handleToggleWishlist}>
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Product Name:</span>
                      <p className="text-muted-foreground">{product.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p className="text-muted-foreground">{product.categories?.name || "Uncategorized"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Stock Quantity:</span>
                      <p className="text-muted-foreground">{product.stock_quantity} units</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="text-muted-foreground">{product.is_active ? "Active" : "Inactive"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date Added:</span>
                      <p className="text-muted-foreground">{format(new Date(product.created_at), "MMMM d, yyyy")}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">{format(new Date(product.updated_at), "MMMM d, yyyy")}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{product.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Technical Specifications</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Product ID</span>
                    <span className="text-muted-foreground">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Price</span>
                    <span className="text-muted-foreground">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Weight</span>
                    <span className="text-muted-foreground">1.2 kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Dimensions</span>
                    <span className="text-muted-foreground">25 × 15 × 8 cm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Material</span>
                    <span className="text-muted-foreground">Premium Quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold">4.8</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on 124 reviews</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-muted"></div>
                          <div>
                            <p className="font-medium">Customer {review}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p className="text-xs text-muted-foreground">Posted on {format(new Date(), "MMM d, yyyy")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">Shipping Options</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Standard Shipping: 3-5 business days (Free)</li>
                      <li>Express Shipping: 1-2 business days ($9.99)</li>
                      <li>International Shipping: 7-14 business days (Rates vary)</li>
                    </ul>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Returns Policy</h4>
                    <p className="text-muted-foreground">
                      We offer a 30-day return policy for unused items in their original packaging. 
                      Please contact our support team to initiate a return.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-1">{product.categories?.name}</p>
                  <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}