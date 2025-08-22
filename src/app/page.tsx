import { Suspense } from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { TrustBadges } from '@/components/home/trust-badges'
import { RecommendedProducts } from '@/components/home/recommended-products'
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
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
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
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
      <Footer />
    </div>
  )
}