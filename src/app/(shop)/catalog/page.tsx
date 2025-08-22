'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductSort } from '@/components/product/product-sort'
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton'
import { useCartStore } from '@/lib/stores/cart-store'

// Mock product data - in real app this would come from Supabase
const mockProducts = [
  {
    id: '1',
    name: 'Premium Racing Helmet',
    brand: 'Arai',
    category: 'Helmets',
    price: 59999, // in cents
    originalPrice: 69999,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 15,
    images: ['🏍️'],
    description: 'Professional racing helmet with advanced ventilation',
    features: ['DOT Certified', 'Lightweight Carbon Fiber', 'Anti-Fog Visor'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'Blue']
  },
  {
    id: '2',
    name: 'Leather Racing Jacket',
    brand: 'Alpinestars',
    category: 'Jackets',
    price: 39999,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockCount: 8,
    images: ['🧥'],
    description: 'Premium leather jacket with CE-approved armor',
    features: ['CE Armor', 'Premium Leather', 'Ventilation Panels'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown']
  },
  {
    id: '3',
    name: 'Waterproof Gloves',
    brand: 'Dainese',
    category: 'Gloves',
    price: 12999,
    originalPrice: 15999,
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    stockCount: 23,
    images: ['🧤'],
    description: 'Waterproof gloves with touchscreen compatibility',
    features: ['Waterproof', 'Touchscreen Compatible', 'Knuckle Protection'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray']
  },
  {
    id: '4',
    name: 'Sport Riding Boots',
    brand: 'TCX',
    category: 'Boots',
    price: 24999,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 156,
    inStock: false,
    stockCount: 0,
    images: ['👢'],
    description: 'Professional sport riding boots with ankle protection',
    features: ['Ankle Protection', 'Non-Slip Sole', 'Breathable Lining'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White']
  },
  {
    id: '5',
    name: 'Carbon Fiber Knee Guards',
    brand: 'Fox Racing',
    category: 'Protection',
    price: 18999,
    originalPrice: 21999,
    rating: 4.5,
    reviewCount: 43,
    inStock: true,
    stockCount: 12,
    images: ['🦵'],
    description: 'Lightweight carbon fiber knee protection',
    features: ['Carbon Fiber', 'Adjustable Straps', 'Impact Resistant'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Carbon']
  },
  {
    id: '6',
    name: 'Touring Backpack',
    brand: 'Kriega',
    category: 'Accessories',
    price: 16999,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 201,
    inStock: true,
    stockCount: 7,
    images: ['🎒'],
    description: 'Waterproof touring backpack with laptop compartment',
    features: ['Waterproof', 'Laptop Compartment', 'Reflective Strips'],
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Orange']
  }
]

const categories = ['All', 'Helmets', 'Jackets', 'Gloves', 'Boots', 'Protection', 'Accessories']
const brands = ['All', 'Arai', 'Alpinestars', 'Dainese', 'TCX', 'Fox Racing', 'Kriega']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' }
]

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !inStockOnly || product.inStock

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'popular':
        return filtered.sort((a, b) => b.reviewCount - a.reviewCount)
      default:
        return filtered
    }
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, inStockOnly])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      variant: 'Default'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 bg-clip-text text-transparent">
                Motorcycle Gear Catalog
              </h1>
              <p className="text-muted-foreground">
                Discover premium motorcycle gear from top brands
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-6">
              <ProductFilters
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                priceRange={priceRange}
                inStockOnly={inStockOnly}
                onCategoryChange={setSelectedCategory}
                onBrandChange={setSelectedBrand}
                onPriceRangeChange={setPriceRange}
                onInStockOnlyChange={setInStockOnly}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ProductSort
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                />
                
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSelectedBrand('All')
                    setPriceRange([0, 100000])
                    setInStockOnly(false)
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}