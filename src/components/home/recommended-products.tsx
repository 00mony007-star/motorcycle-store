'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

// Mock recommended products
const recommendedProducts = [
  {
    id: '5',
    title: 'Sport Touring Helmet',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
    slug: 'sport-touring-helmet'
  },
  {
    id: '6',
    title: 'Mesh Summer Jacket',
    price: 19999,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    slug: 'mesh-summer-jacket'
  },
  {
    id: '7',
    title: 'Waterproof Gloves',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    slug: 'waterproof-gloves'
  },
  {
    id: '8',
    title: 'Adventure Boots',
    price: 29999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    slug: 'adventure-boots'
  },
]

export function RecommendedProducts() {
  return (
    <div>
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
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
            Recommended for You
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Curated selections based on your interests and riding style.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  </div>
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
    </div>
  )
}