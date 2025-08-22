'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

// Mock data with working image URLs
const featuredProducts = [
  {
    id: '1',
    title: 'Premium Racing Helmet',
    price: 29999,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    slug: 'premium-racing-helmet'
  },
  {
    id: '2', 
    title: 'Leather Racing Jacket',
    price: 49999,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    slug: 'leather-racing-jacket'
  },
  {
    id: '3',
    title: 'Carbon Fiber Gloves',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    slug: 'carbon-fiber-gloves'
  },
  {
    id: '4',
    title: 'Performance Boots',
    price: 34999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    slug: 'performance-boots'
  },
]

export function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <Card className="premium-card h-full overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/400x400/64748b/ffffff?text=${encodeURIComponent(product.title)}`
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
                  {product.title}
                </h3>
                <p className="text-3xl font-bold text-orange-500 mb-4">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link href={`/product/${product.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}