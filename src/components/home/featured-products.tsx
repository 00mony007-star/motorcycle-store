'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/lib/stores/cart-store'
import Link from 'next/link'

// Mock data with CSS-based placeholders
const featuredProducts = [
  {
    id: '1',
    title: 'Premium Racing Helmet',
    price: 29999,
    emoji: '🏍️',
    gradient: 'from-red-500 to-red-700',
    slug: 'premium-racing-helmet'
  },
  {
    id: '2', 
    title: 'Leather Racing Jacket',
    price: 49999,
    emoji: '🧥',
    gradient: 'from-brown-500 to-brown-700',
    slug: 'leather-racing-jacket'
  },
  {
    id: '3',
    title: 'Carbon Fiber Gloves',
    price: 15999,
    emoji: '🧤',
    gradient: 'from-gray-500 to-gray-700',
    slug: 'carbon-fiber-gloves'
  },
  {
    id: '4',
    title: 'Performance Boots',
    price: 34999,
    emoji: '👢',
    gradient: 'from-black to-gray-800',
    slug: 'performance-boots'
  },
]

export function FeaturedProducts() {
  const { addItem } = useCartStore()

  const handleAddToCart = (product: any) => {
    // Convert to the format expected by cart store
    const cartProduct = {
      id: product.id,
      title: product.title,
      price: {
        amount_cents: product.price
      },
      media: [],
      brand: { name: 'MotoGear' },
      slug: product.slug
    }
    
    addItem(cartProduct)
  }

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
          <Card className="h-full overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="p-0">
              <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                <div className="text-6xl">{product.emoji}</div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors text-slate-900">
                  {product.title}
                </h3>
                <p className="text-3xl font-bold text-orange-500 mb-4">
                  ${(product.price / 100).toFixed(2)}
                </p>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    🛒 Add to Cart
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/product/${product.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}