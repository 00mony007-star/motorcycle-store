import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Checkout schema
const CheckoutSchema = z.object({
  // Shipping information
  shipping: z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().default('United States')
  }),
  
  // Payment information
  payment: z.object({
    method: z.enum(['credit_card', 'paypal', 'apple_pay', 'google_pay']),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    nameOnCard: z.string().optional()
  }),
  
  // Cart items
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    variant: z.string(),
    price: z.number().positive()
  })).min(1, 'Cart cannot be empty'),
  
  // Totals
  totals: z.object({
    subtotal: z.number(),
    tax: z.number(),
    shipping: z.number(),
    discount: z.number().default(0),
    total: z.number()
  }),
  
  // Optional coupon
  couponCode: z.string().optional()
})

// Mock orders storage
let mockOrders: any[] = []

// POST /api/checkout - Process checkout and create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const checkoutData = CheckoutSchema.parse(body)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    // Create order object
    const order = {
      id: Math.random().toString(36).substring(7),
      orderNumber,
      status: 'pending',
      customer: {
        email: checkoutData.shipping.email,
        firstName: checkoutData.shipping.firstName,
        lastName: checkoutData.shipping.lastName
      },
      shipping: checkoutData.shipping,
      payment: {
        method: checkoutData.payment.method,
        status: 'pending',
        // Don't store sensitive payment info
        last4: checkoutData.payment.cardNumber?.slice(-4) || null
      },
      items: checkoutData.items.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(7)
      })),
      totals: checkoutData.totals,
      couponCode: checkoutData.couponCode || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real app, this would:
    // 1. Validate inventory
    // 2. Reserve stock
    // 3. Process payment with Stripe
    // 4. Save order to Supabase
    // 5. Send confirmation email
    // 6. Update inventory

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock payment success (90% success rate)
    const paymentSuccess = Math.random() > 0.1

    if (!paymentSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment failed. Please try again or use a different payment method.' 
        },
        { status: 402 }
      )
    }

    // Update order status
    order.status = 'confirmed'
    order.payment.status = 'completed'

    // Save order
    mockOrders.push(order)

    // In real app, clear the user's cart here
    
    return NextResponse.json({
      success: true,
      data: {
        order,
        redirectUrl: `/order-confirmation/${order.orderNumber}`
      },
      message: 'Order placed successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Checkout Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid checkout data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Checkout failed. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// GET /api/checkout - Get checkout session (for resuming interrupted checkouts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID is required' 
        },
        { status: 400 }
      )
    }

    // In real app, fetch session from database
    // For now, return empty session
    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        items: [],
        shipping: null,
        payment: null
      }
    })

  } catch (error) {
    console.error('Get Checkout Session Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch checkout session' 
      },
      { status: 500 }
    )
  }
}