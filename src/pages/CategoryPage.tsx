import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getApi } from '../lib/api'
import { Product, Category as CategoryType } from '../lib/types'
import { ProductGrid } from '../components/Product/ProductGrid'
import { Loader2, Filter } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { Label } from '../components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../components/ui/Pagination'
import { usePagination, DOTS } from '../hooks/use-pagination'

const api = getApi()
const PAGE_SIZE = 12

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])
  const [allCategories, setAllCategories] = useState<CategoryType[]>([])
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  // Filtering and sorting state from URL
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const currentPage = parseInt(queryParams.get('page') || '1', 10)
  const currentSort = queryParams.get('sort') || 'new'
  const currentBrands = queryParams.getAll('brand')

  const updateQuery = (key: string, value: string | string[]) => {
    const newParams = new URLSearchParams(location.search)
    newParams.delete(key)
    if (Array.isArray(value)) {
      value.forEach(v => newParams.append(key, v))
    } else if (value) {
      newParams.set(key, value)
    }
    newParams.set('page', '1') // Reset to first page on filter change
    navigate(`${location.pathname}?${newParams.toString()}`)
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [cats, prods] = await Promise.all([
          api.categories.list(),
          api.products.list({ 
            categoryId: slug === 'all' ? undefined : currentCategory?.id,
            sort: currentSort as any,
            brand: currentBrands.length > 0 ? currentBrands : undefined,
          })
        ])
        setAllCategories(cats)
        if (slug !== 'all') {
            const foundCategory = cats.find(c => c.slug === slug)
            setCurrentCategory(foundCategory || null)
        } else {
            setCurrentCategory({id: 'all', slug: 'all', name: 'All Products'})
        }
        
        setProducts(prods)
        setTotalProducts(prods.length) // Using length of returned array as total for now
      } catch (error) {
        console.error("Failed to fetch category data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [slug, currentCategory?.id, currentSort, currentBrands.join(',')])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return products.slice(startIndex, startIndex + PAGE_SIZE)
  }, [products, currentPage])

  const paginationRange = usePagination({
    currentPage,
    totalCount: totalProducts,
    pageSize: PAGE_SIZE,
  })

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand)
    updateQuery('brand', newBrands)
  }

  const uniqueBrands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]) as string[]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{currentCategory?.name || 'Shop'}</h1>
        <p className="text-muted-foreground mt-2">Browse our collection of high-quality motorcycle gear.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><Filter className="mr-2 h-5 w-5" /> Filters</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <ul className="space-y-1">
                {allCategories.map(cat => (
                  <li key={cat.id}>
                    <a href={`/category/${cat.slug}`} className={`text-sm ${slug === cat.slug ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}>
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Brand</h3>
              <div className="space-y-2">
                {uniqueBrands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox id={`brand-${brand}`} checked={currentBrands.includes(brand)} onCheckedChange={(checked) => handleBrandChange(brand, !!checked)} />
                    <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">{brand}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* More filters like price range can be added here */}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">Showing {paginatedProducts.length} of {totalProducts} products</p>
            <Select value={currentSort} onValueChange={(value) => updateQuery('sort', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) updateQuery('page', (currentPage - 1).toString()) }} />
                    </PaginationItem>
                    {paginationRange.map((pageNumber, index) => {
                      if (pageNumber === DOTS) {
                        return <PaginationItem key={`${DOTS}-${index}`}><PaginationEllipsis /></PaginationItem>
                      }
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink href="#" isActive={pageNumber === currentPage} onClick={(e) => {e.preventDefault(); updateQuery('page', pageNumber.toString())}}>
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < Math.ceil(totalProducts / PAGE_SIZE)) updateQuery('page', (currentPage + 1).toString()) }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold">No Products Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
