import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Product schema for validation
const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  stockCount: z.number().min(0, 'Stock count cannot be negative'),
  images: z.array(z.string()).min(1, 'At least one image is required')
})

const ProductQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  inStockOnly: z.string().transform(Boolean).optional(),
  sortBy: z.enum(['name', 'price', 'rating', 'newest']).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12')
})

// Mock products data - in real app this would come from Supabase
const mockProducts = [
  {
    id: '1',
    name: 'Premium Racing Helmet',
    brand: 'Arai',
    category: 'Helmets',
    price: 59999,
    originalPrice: 69999,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 15,
    images: ['🏍️', '🪖', '⚡', '🔥'],
    description: 'Professional racing helmet with advanced ventilation system and lightweight carbon fiber construction.',
    features: ['DOT Certified', 'Lightweight Carbon Fiber', 'Anti-Fog Visor', 'Advanced Ventilation'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'Blue', 'White'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
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
    description: 'Premium leather jacket with CE-approved armor for maximum protection.',
    features: ['CE Armor', 'Premium Leather', 'Ventilation Panels'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown'],
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
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
    description: 'Waterproof gloves with touchscreen compatibility and knuckle protection.',
    features: ['Waterproof', 'Touchscreen Compatible', 'Knuckle Protection'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray'],
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
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
    description: 'Professional sport riding boots with ankle protection and non-slip sole.',
    features: ['Ankle Protection', 'Non-Slip Sole', 'Breathable Lining'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White'],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  }
]

// GET /api/products - Fetch products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = ProductQuerySchema.parse(Object.fromEntries(searchParams))

    let filteredProducts = [...mockProducts]

    // Apply filters
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    if (query.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === query.category
      )
    }

    if (query.brand) {
      filteredProducts = filteredProducts.filter(product =>
        product.brand === query.brand
      )
    }

    if (query.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= query.minPrice!
      )
    }

    if (query.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= query.maxPrice!
      )
    }

    if (query.inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.inStock)
    }

    // Apply sorting
    switch (query.sortBy) {
      case 'price':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
    }

    // Apply pagination
    const startIndex = (query.page - 1) * query.limit
    const endIndex = startIndex + query.limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / query.limit)
        }
      }
    })
  } catch (error) {
    console.error('Products API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productData = ProductSchema.parse(body)

    // In real app, this would save to Supabase
    const newProduct = {
      id: Math.random().toString(36).substring(7),
      ...productData,
      rating: 0,
      reviewCount: 0,
      inStock: productData.stockCount > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Simulate database save
    mockProducts.push(newProduct)

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create Product Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid product data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product' 
      },
      { status: 500 }
    )
  }
}