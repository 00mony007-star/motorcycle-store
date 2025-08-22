'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

// Mock data for demonstration
const featuredProducts = [
  {
    id: '1',
    title: 'Premium Racing Helmet',
    price: 29999,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    slug: 'premium-racing-helmet'
  },
  {
    id: '2', 
    title: 'Leather Racing Jacket',
    price: 49999,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    slug: 'leather-racing-jacket'
  },
  {
    id: '3',
    title: 'Carbon Fiber Gloves',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    slug: 'carbon-fiber-gloves'
  },
  {
    id: '4',
    title: 'Performance Boots',
    price: 34999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
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
          <Card className="premium-card h-full overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-2xl font-bold text-primary mb-4">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <Button asChild className="w-full">
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