'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    id: '1',
    name: 'Helmets',
    description: 'Premium safety helmets',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    slug: 'helmets'
  },
  {
    id: '2',
    name: 'Jackets',
    description: 'Protective riding jackets',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    slug: 'jackets'
  },
  {
    id: '3',
    name: 'Gloves',
    description: 'High-performance gloves',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    slug: 'gloves'
  },
  {
    id: '4',
    name: 'Boots',
    description: 'Professional riding boots',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
    slug: 'boots'
  },
]

export function CategoryShowcase() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 bg-clip-text text-transparent">
          Shop by Category
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Find the perfect gear for every part of your ride. From head to toe protection.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link href={`/category/${category.slug}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-slate-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/600x400/64748b/ffffff?text=${encodeURIComponent(category.name)}`
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.description}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors">
                Shop {category.name}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}