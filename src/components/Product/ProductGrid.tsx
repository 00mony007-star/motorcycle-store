import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Product } from '../../lib/types'
import { ProductCard } from './ProductCard'
import { Loader2 } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  className?: string
  enableVirtualization?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.9
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for premium feel
    },
  },
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
)

export function ProductGrid({ 
  products, 
  isLoading = false, 
  className = '',
  enableVirtualization = false 
}: ProductGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px 0px',
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div 
            key={product.id} 
            variants={itemVariants}
            layout
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group"
          >
            <ProductCard 
              product={product} 
              priority={index < 4} // Prioritize first 4 images for LCP
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// Enhanced loading component for better UX
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.05,
            duration: 0.4,
            ease: "easeOut"
          }}
          className="premium-card overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-muted loading-shimmer" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded loading-shimmer" />
              <div className="h-3 bg-muted rounded w-2/3 loading-shimmer" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-1/3 loading-shimmer" />
              <div className="h-3 bg-muted rounded w-1/4 loading-shimmer" />
            </div>
            
            <div className="h-9 bg-muted rounded loading-shimmer" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
