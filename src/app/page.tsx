import { Suspense } from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { TrustBadges } from '@/components/home/trust-badges'
import { RecommendedProducts } from '@/components/home/recommended-products'
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton'

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section with Video Background */}
      <HeroSection />
      
      {/* Trust Badges */}
      <section className="py-8 bg-muted/30">
        <div className="container">
          <TrustBadges />
        </div>
      </section>
      
      {/* Category Showcase */}
      <section className="py-16">
        <div className="container">
          <CategoryShowcase />
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold heading-premium mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium motorcycle gear, 
              chosen for their exceptional quality and performance.
            </p>
          </div>
          
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
      
      {/* Recommended Products */}
      <section className="py-16">
        <div className="container">
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <RecommendedProducts />
          </Suspense>
        </div>
      </section>
    </main>
  )
}