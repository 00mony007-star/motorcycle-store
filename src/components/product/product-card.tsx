'use client'

import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ProductCardProps {
  product: {
    id: string
    name: string
    brand: string
    category: string
    price: number
    originalPrice?: number | null
    rating: number
    reviewCount: number
    inStock: boolean
    stockCount: number
    images: string[]
    description: string
    features: string[]
    sizes: string[]
    colors: string[]
  }
  viewMode: 'grid' | 'list'
  onAddToCart: () => void
}

export function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Product Image */}
              <div className="relative sm:w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <span className="text-6xl">{product.images[0]}</span>
                
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discountPercentage}%
                  </div>
                )}
                
                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg hover:text-orange-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/product/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        onClick={onAddToCart}
                        disabled={!product.inStock}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {product.images[0]}
            </span>
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercentage}%
              </div>
            )}
            
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
            
            {/* Quick View */}
            <Link href={`/product/${product.id}`}>
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </Link>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold hover:text-orange-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock Info */}
            {product.inStock && product.stockCount <= 5 && (
              <p className="text-xs text-orange-600 mb-3">
                Only {product.stockCount} left in stock!
              </p>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={onAddToCart}
              disabled={!product.inStock}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}