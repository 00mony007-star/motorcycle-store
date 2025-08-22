'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

// Mock recommended products with CSS placeholders
const recommendedProducts = [
  {
    id: '5',
    title: 'Sport Touring Helmet',
    price: 24999,
    emoji: '🏍️',
    gradient: 'from-indigo-500 to-indigo-700',
    slug: 'sport-touring-helmet'
  },
  {
    id: '6',
    title: 'Mesh Summer Jacket',
    price: 19999,
    emoji: '🌬️',
    gradient: 'from-cyan-500 to-cyan-700',
    slug: 'mesh-summer-jacket'
  },
  {
    id: '7',
    title: 'Waterproof Gloves',
    price: 8999,
    emoji: '💧',
    gradient: 'from-blue-500 to-blue-700',
    slug: 'waterproof-gloves'
  },
  {
    id: '8',
    title: 'Adventure Boots',
    price: 29999,
    emoji: '🥾',
    gradient: 'from-orange-500 to-orange-700',
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
            <Sparkles className="w-6 h-6 text-orange-500" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 bg-clip-text text-transparent">
            Recommended for You
          </h2>
        </div>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
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
            <Card className="h-full overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-0">
                <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                  <div className="text-6xl">{product.emoji}</div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors text-slate-900">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-orange-500 mb-4">
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
    </div>
  )
}