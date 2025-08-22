'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface ProductGridSkeletonProps {
  count?: number
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <Card className="premium-card h-full overflow-hidden">
            <CardContent className="p-0">
              {/* Image skeleton */}
              <div className="aspect-square bg-muted shimmer" />
              
              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-3 bg-muted rounded w-2/3 shimmer" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-1/3 shimmer" />
                  <div className="h-3 bg-muted rounded w-1/4 shimmer" />
                </div>
                
                <div className="h-9 bg-muted rounded shimmer" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}