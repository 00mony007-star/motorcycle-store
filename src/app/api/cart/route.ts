import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Cart item schema
const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  variant: z.string().optional()
})

const UpdateCartItemSchema = z.object({
  quantity: z.number().min(0, 'Quantity cannot be negative')
})

// Mock cart data - in real app this would be stored in Supabase
let mockCarts: Record<string, any> = {}

// Helper function to get user ID (in real app this would come from auth)
function getUserId(request: NextRequest): string {
  // For demo purposes, use session or create anonymous user
  const sessionId = request.headers.get('x-session-id') || 'anonymous'
  return sessionId
}

// GET /api/cart - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    const cart = mockCarts[userId] || { items: [], updatedAt: new Date().toISOString() }

    return NextResponse.json({
      success: true,
      data: cart
    })
  } catch (error) {
    console.error('Get Cart Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cart' 
      },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity, variant } = CartItemSchema.parse(body)
    const userId = getUserId(request)

    // Get or create cart
    if (!mockCarts[userId]) {
      mockCarts[userId] = { items: [], updatedAt: new Date().toISOString() }
    }

    const cart = mockCarts[userId]
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId && item.variant === variant
    )

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.items.push({
        id: Math.random().toString(36).substring(7),
        productId,
        quantity,
        variant: variant || 'Default',
        addedAt: new Date().toISOString()
      })
    }

    cart.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    })

  } catch (error) {
    console.error('Add to Cart Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid cart item data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add item to cart' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, quantity } = z.object({
      itemId: z.string().min(1, 'Item ID is required'),
      quantity: z.number().min(0, 'Quantity cannot be negative')
    }).parse(body)
    
    const userId = getUserId(request)
    const cart = mockCarts[userId]

    if (!cart) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cart not found' 
        },
        { status: 404 }
      )
    }

    const itemIndex = cart.items.findIndex((item: any) => item.id === itemId)

    if (itemIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cart item not found' 
        },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity
    }

    cart.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      data: cart,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully'
    })

  } catch (error) {
    console.error('Update Cart Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid update data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update cart' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request)
    
    if (mockCarts[userId]) {
      mockCarts[userId] = { items: [], updatedAt: new Date().toISOString() }
    }

    return NextResponse.json({
      success: true,
      data: mockCarts[userId] || { items: [], updatedAt: new Date().toISOString() },
      message: 'Cart cleared successfully'
    })

  } catch (error) {
    console.error('Clear Cart Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear cart' 
      },
      { status: 500 }
    )
  }
}