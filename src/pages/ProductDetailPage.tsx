import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApi } from '../lib/api'
import { Product, Variant } from '../lib/types'
import { Loader2, ShoppingCart, Heart, CheckCircle, Shield } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StarRating } from '../components/ui/StarRating'
import { formatCurrency } from '../lib/utils'
import { ProductGrid } from '../components/Product/ProductGrid'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/Accordion'
import { useCartStore } from '../lib/stores/cartStore'
import { useToast } from '../hooks/use-toast'

const api = getApi()

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { toast } = useToast()
  const addItemToCart = useCartStore((state) => state.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [mainImage, setMainImage] = useState<string>('')

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return
      setIsLoading(true)
      try {
        const fetchedProduct = await api.products.getBySlug(slug)
        setProduct(fetchedProduct)
        if (fetchedProduct) {
          setMainImage(fetchedProduct.images[0])
          // Initialize selected variants
          const initialVariants: Record<string, string> = {}
          fetchedProduct.variants?.forEach(v => {
            initialVariants[v.name] = v.options[0]
          })
          setSelectedVariants(initialVariants)

          // Fetch related products
          const related = await api.products.list({ categoryId: fetchedProduct.category.id, limit: 5 })
          setRelatedProducts(related.filter(p => p.id !== fetchedProduct.id).slice(0, 4))
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [slug])
  
  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }))
  }

  const handleAddToCart = () => {
    if (!product) return
    // For simplicity, we pass the first selected variant to the cart store
    const firstVariantKey = product.variants?.[0]?.name
    const selectedVariant = firstVariantKey ? { name: firstVariantKey, option: selectedVariants[firstVariantKey] } : undefined
    
    addItemToCart(product, selectedVariant)
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="h-12 w-12 animate-spin" /></div>
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>
  }

  const stockStatus = product.stock > 0 ? (product.stock < 10 ? `Low stock (${product.stock} left)` : 'In Stock') : 'Out of Stock'

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div>
          <div className="border rounded-lg overflow-hidden mb-4">
            <img src={mainImage} alt={product.title} className="w-full h-auto object-cover aspect-square" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img, index) => (
              <button key={index} onClick={() => setMainImage(img)} className={`border rounded-md overflow-hidden ${mainImage === img ? 'ring-2 ring-primary' : ''}`}>
                <img src={img} alt={`${product.title} thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Link to={`/category/${product.category.slug}`} className="text-sm text-muted-foreground hover:text-primary">{product.category.name}</Link>
            <h1 className="text-3xl lg:text-4xl font-bold">{product.title}</h1>
            <div className="flex items-center space-x-4">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
            </div>
          </div>
          
          <div className="text-3xl font-bold flex items-center gap-4">
            <span>{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="text-sm">{product.shortDescription}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map((variant: Variant) => (
                <div key={variant.id}>
                  <h3 className="text-sm font-medium mb-2">{variant.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => (
                      <Button
                        key={option}
                        variant={selectedVariants[variant.name] === option ? 'default' : 'outline'}
                        onClick={() => handleVariantSelect(variant.name, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>{stockStatus}</Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>

          <div className="border-t pt-6 space-y-4 text-sm">
            <div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /><span>Free shipping on orders over $100</span></div>
            <div className="flex items-center"><Shield className="h-5 w-5 text-blue-500 mr-2" /><span>DOT & ECE Certified for safety</span></div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1">
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger>Reviews ({product.reviewCount})</AccordionTrigger>
              <AccordionContent>
                <p>Customer reviews are coming soon.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-8">You Might Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
