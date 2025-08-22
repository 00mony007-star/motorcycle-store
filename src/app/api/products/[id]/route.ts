import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Product update schema
const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().positive().optional(),
  description: z.string().min(10).optional(),
  features: z.array(z.string()).min(1).optional(),
  sizes: z.array(z.string()).min(1).optional(),
  colors: z.array(z.string()).min(1).optional(),
  stockCount: z.number().min(0).optional(),
  images: z.array(z.string()).min(1).optional()
})

// Mock products data - in real app this would come from Supabase
let mockProducts = [
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
  }
]

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/products/[id] - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const product = mockProducts.find(p => p.id === params.id)

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Get Product Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json()
    const updateData = ProductUpdateSchema.parse(body)

    const productIndex = mockProducts.findIndex(p => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...updateData,
      inStock: updateData.stockCount !== undefined ? updateData.stockCount > 0 : mockProducts[productIndex].inStock,
      updatedAt: new Date().toISOString()
    }

    mockProducts[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Update Product Error:', error)
    
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
        error: 'Failed to update product' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }

    // Remove product
    const deletedProduct = mockProducts.splice(productIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete Product Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product' 
      },
      { status: 500 }
    )
  }
}