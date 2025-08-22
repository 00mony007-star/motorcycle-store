'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { formatPrice } from '@/lib/utils'
import { X } from 'lucide-react'

interface ProductFiltersProps {
  categories: string[]
  brands: string[]
  selectedCategory: string
  selectedBrand: string
  priceRange: number[]
  inStockOnly: boolean
  onCategoryChange: (category: string) => void
  onBrandChange: (brand: string) => void
  onPriceRangeChange: (range: number[]) => void
  onInStockOnlyChange: (checked: boolean) => void
}

export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  inStockOnly,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onInStockOnlyChange,
}: ProductFiltersProps) {
  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedBrand !== 'All' || 
    priceRange[0] > 0 || 
    priceRange[1] < 100000 || 
    inStockOnly

  const clearAllFilters = () => {
    onCategoryChange('All')
    onBrandChange('All')
    onPriceRangeChange([0, 100000])
    onInStockOnlyChange(false)
  }

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategory === category}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrand === brand}
                onCheckedChange={() => onBrandChange(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock-only"
              checked={inStockOnly}
              onCheckedChange={onInStockOnlyChange}
            />
            <Label
              htmlFor="in-stock-only"
              className="text-sm font-normal cursor-pointer"
            >
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              onCategoryChange('Helmets')
              onPriceRangeChange([50000, 100000])
            }}
          >
            Premium Helmets
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              onCategoryChange('All')
              onPriceRangeChange([0, 20000])
            }}
          >
            Under $200
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              onBrandChange('Alpinestars')
              onCategoryChange('All')
            }}
          >
            Alpinestars Gear
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              onCategoryChange('All')
              onInStockOnlyChange(true)
              onPriceRangeChange([0, 30000])
            }}
          >
            Sale Items
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}