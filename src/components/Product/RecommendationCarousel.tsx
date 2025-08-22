import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { Product } from '../../lib/types'
import { ProductCard } from './ProductCard'
import { Button } from '../ui/Button'
import { useTranslation } from 'react-i18next'
import { getApi } from '../../lib/api'

interface RecommendationCarouselProps {
  userId?: string
  currentProductId?: string
  categoryId?: string
  title?: string
  className?: string
}

export function RecommendationCarousel({ 
  userId, 
  currentProductId, 
  categoryId,
  title,
  className = '' 
}: RecommendationCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  })
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const { t } = useTranslation()

  const api = getApi()

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  const onSelect = () => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi])

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true)
      try {
        // Simulate recommendation algorithm
        let products: Product[] = []
        
        if (currentProductId) {
          // Get related products from same category
          const currentProduct = await api.products.getById(currentProductId)
          if (currentProduct) {
            products = await api.products.list({ 
              categoryId: currentProduct.category.id,
              limit: 8,
              excludeId: currentProductId
            })
          }
        } else if (categoryId) {
          // Get popular products from category
          products = await api.products.list({ 
            categoryId,
            sort: 'popular',
            limit: 8
          })
        } else {
          // Get personalized recommendations based on user history
          // For now, get featured and popular products
          products = await api.products.list({ 
            featured: true,
            limit: 8
          })
          
          if (products.length < 8) {
            const additional = await api.products.list({ 
              sort: 'popular',
              limit: 8 - products.length
            })
            products = [...products, ...additional]
          }
        }

        setRecommendations(products)
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId, currentProductId, categoryId])

  if (isLoading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="text-2xl font-display font-bold">
              {title || t('recommendations.loading', 'Loading recommendations...')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card p-4 space-y-4"
              >
                <div className="aspect-square bg-muted rounded-lg loading-shimmer" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded loading-shimmer" />
                  <div className="h-3 bg-muted rounded w-3/4 loading-shimmer" />
                  <div className="h-4 bg-muted rounded w-1/2 loading-shimmer" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold heading-premium">
              {title || t('recommendations.title', 'Recommended for You')}
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="focus-ring"
              aria-label="Previous recommendations"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="focus-ring"
              aria-label="Next recommendations"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 px-3"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <ProductCard product={product} priority={index < 4} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(recommendations.length / 4) }).map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-muted hover:bg-primary transition-colors duration-300"
              aria-label={`Go to recommendation group ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Hook for tracking user preferences and generating recommendations
export function useRecommendations(userId?: string) {
  const [userPreferences, setUserPreferences] = useState({
    viewedCategories: new Set<string>(),
    viewedBrands: new Set<string>(),
    priceRange: { min: 0, max: 1000 },
    lastActivity: new Date()
  })

  const trackProductView = (product: Product) => {
    setUserPreferences(prev => ({
      ...prev,
      viewedCategories: new Set([...prev.viewedCategories, product.category.id]),
      viewedBrands: new Set([...prev.viewedBrands, product.brand || '']),
      lastActivity: new Date()
    }))
  }

  const trackCategoryView = (categoryId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      viewedCategories: new Set([...prev.viewedCategories, categoryId]),
      lastActivity: new Date()
    }))
  }

  return {
    userPreferences,
    trackProductView,
    trackCategoryView
  }
}