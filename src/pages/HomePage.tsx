import React, { useEffect, useState } from 'react'
import { ProductGrid } from '../components/Product/ProductGrid'
import { Button } from '../components/ui/Button'
import { getApi } from '../lib/api'
import { Product } from '../lib/types'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ShopByCategory } from '../components/home/ShopByCategory'
import { TrustBadges } from '../components/home/TrustBadges'
import { HeroSlider } from '../components/home/HeroSlider'
import { BrandMarquee } from '../components/home/BrandMarquee'
import { RecommendationCarousel } from '../components/Product/RecommendationCarousel'

const api = getApi()

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      try {
        const [featured, newest] = await Promise.all([
          api.products.list({ featured: true, limit: 4 }),
          api.products.list({ sort: 'new', limit: 8 }),
        ])
        setFeaturedProducts(featured)
        setNewArrivals(newest)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Dynamic Hero Slider */}
      <HeroSlider />

      {/* Brand Marquee */}
      <BrandMarquee />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Shop By Category Section */}
      <ShopByCategory />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{t('home.featuredProducts')}</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{t('home.newArrivals')}</h2>
            <ProductGrid products={newArrivals} />
             <div className="text-center mt-12">
              <Button asChild size="lg" variant="secondary">
                <Link to="/category/all">{t('home.exploreMore')}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Personalized Recommendations */}
      <RecommendationCarousel 
        title={t('home.recommendedForYou', 'Recommended for You')}
        className="bg-muted/30"
      />
    </div>
  )
}
