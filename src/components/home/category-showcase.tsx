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
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
    slug: 'helmets'
  },
  {
    id: '2',
    name: 'Jackets',
    description: 'Protective riding jackets',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
    slug: 'jackets'
  },
  {
    id: '3',
    name: 'Gloves',
    description: 'High-performance gloves',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    slug: 'gloves'
  },
  {
    id: '4',
    name: 'Boots',
    description: 'Professional riding boots',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop',
    slug: 'boots'
  },
]

export function CategoryShowcase() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-display font-bold heading-premium mb-4">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.description}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Shop {category.name}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}