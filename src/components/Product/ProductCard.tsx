import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Product } from '../../lib/types'
import { formatCurrency } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { StarRating } from '../ui/StarRating'
import { Badge } from '../ui/Badge'
import { ShoppingCart, Loader2, Check, Heart, Eye, Zap } from 'lucide-react'
import { useCartStore } from '../../lib/stores/cartStore'
import { useTranslation } from 'react-i18next'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const addItemToCart = useCartStore((state) => state.addItem)
  const { t } = useTranslation()
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (addStatus !== 'idle') return

    setAddStatus('loading')
    
    // Simulate API call with realistic timing
    setTimeout(() => {
      addItemToCart(product)
      setAddStatus('success')
      setTimeout(() => setAddStatus('idle'), 2000)
    }, 600)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const getButtonContent = () => {
    switch (addStatus) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <Loader2 className="h-4 w-4 animate-spin me-2" />
            {t('product.adding', 'Adding...')}
          </motion.div>
        )
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center"
          >
            <Check className="me-2 h-4 w-4" />
            {t('product.added', 'Added!')}
          </motion.div>
        )
      case 'idle':
      default:
        return (
          <div className="flex items-center">
            <ShoppingCart className="me-2 h-4 w-4" />
            {product.stock > 0 ? t('product.addToCart', 'Add to Cart') : t('product.outOfStock', 'Out of Stock')}
          </div>
        )
    }
  }

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="premium-card h-full flex flex-col overflow-hidden group">
        <Link 
          to={`/product/${product.slug}`} 
          className="flex flex-col flex-grow focus-ring rounded-lg"
          aria-label={`View ${product.title} details`}
        >
          <CardContent className="p-0 flex flex-col flex-grow">
            {/* Image Container */}
            <div className="relative overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              
              <motion.img
                src={product.images[0]}
                alt={product.title}
                loading={priority ? 'eager' : 'lazy'}
                className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110"
                onLoad={() => setImageLoaded(true)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Overlay with quick actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
                      aria-label="Quick view"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleWishlistToggle}
                      className={`backdrop-blur-sm transition-colors ${
                        isWishlisted 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-white/90 hover:bg-white text-black'
                      }`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {product.compareAtPrice && discountPercentage > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Badge variant="destructive" className="shadow-lg">
                      -{discountPercentage}%
                    </Badge>
                  </motion.div>
                )}
                {product.featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: 12 }}
                    animate={{ scale: 1, rotate: 12 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-lg">
                      <Zap className="w-3 h-3 me-1" />
                      {t('product.featured', 'Featured')}
                    </Badge>
                  </motion.div>
                )}
              </div>

              {/* Stock indicator */}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge 
                  variant="outline" 
                  className="absolute top-3 right-3 bg-orange-500/90 text-white border-orange-500"
                >
                  {t('product.lowStock', `Only ${product.stock} left`)}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3 flex flex-col flex-grow">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-muted-foreground font-medium">
                  {product.brand}
                </p>
              )}

              {/* Title */}
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {product.title}
              </h3>

              {/* Short description */}
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <StarRating rating={product.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                
                {/* Category badge */}
                <Badge variant="outline" className="text-xs">
                  {product.category.name}
                </Badge>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-2 mt-auto">
                <div className="flex items-center space-x-2">
                  <motion.p 
                    className="text-xl font-bold text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    {formatCurrency(product.price)}
                  </motion.p>
                  {product.compareAtPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Link>

        {/* Add to Cart Button */}
        <div className="p-4 pt-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className={`w-full btn-premium transition-all duration-300 ${
                addStatus === 'success' 
                  ? 'bg-green-500 hover:bg-green-600 shadow-glow-blue' 
                  : ''
              }`}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addStatus === 'loading'}
              aria-label={`Add ${product.title} to cart`}
            >
              {getButtonContent()}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
