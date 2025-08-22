import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApi } from '../../lib/api'
import { Category } from '../../lib/types'
import { Card } from '../ui/Card'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const api = getApi()

export function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await api.categories.list()
        setCategories(fetchedCategories.slice(0, 4)) 
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 uppercase tracking-wider">{t('home.shopByCategory')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg"
            >
              <Link to={`/category/${category.slug}`}>
                <Card className="overflow-hidden group relative text-white border-none shadow-none bg-zinc-900 h-96">
                  <img 
                    src={category.image || `https://picsum.photos/seed/${category.slug}/400/600`} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80" 
                  />
                  <div className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xl font-bold uppercase tracking-widest">{category.name}</h3>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
