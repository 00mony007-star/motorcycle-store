'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowLeft, Lock, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { 
    items, 
    isOpen, 
    subtotalCents, 
    taxCents, 
    shippingCents, 
    discountCents, 
    totalCents,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    couponCode
  } = useCartStore()

  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    
    setIsApplyingPromo(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock promo code validation
    if (promoCode.toLowerCase() === 'save10') {
      applyCoupon(promoCode, 'SAVE10', 1000) // $10 off
    } else if (promoCode.toLowerCase() === 'free20') {
      applyCoupon(promoCode, 'FREE20', Math.round(subtotalCents * 0.2)) // 20% off
    }
    
    setIsApplyingPromo(false)
    setPromoCode('')
  }

  const freeShippingThreshold = 10000 // $100 in cents
  const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotalCents)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="space-y-3">
              <Link href="/catalog">
                <Button className="w-full">
                  Browse Products
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">{item.image}</span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.variant}</p>
                              <p className="text-lg font-bold mt-1">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">
                              Item Total:
                            </span>
                            <span className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Free Shipping Progress */}
            {needsForFreeShipping > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm">
                      Add <span className="font-semibold text-green-600">
                        {formatPrice(needsForFreeShipping)}
                      </span> more for free shipping!
                    </p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (subtotalCents / freeShippingThreshold) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Promo Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-md">
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">
                        {couponCode}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        -{formatPrice(discountCents)} discount applied
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim() || isApplyingPromo}
                      variant="outline"
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Try: <code className="bg-muted px-1 rounded">SAVE10</code> or{' '}
                  <code className="bg-muted px-1 rounded">FREE20</code>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotalCents)}</span>
                  </div>
                  
                  {discountCents > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatPrice(discountCents)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {shippingCents === 0 ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : (
                        formatPrice(shippingCents)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatPrice(taxCents)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(totalCents)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      <Lock className="h-4 w-4 mr-2" />
                      Secure Checkout
                    </Button>
                  </Link>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Secure
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Encrypted
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Fast Shipping
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">We Accept</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-2xl">💳</div>
                  <div className="text-2xl">🅿️</div>
                  <div className="text-2xl">🍎</div>
                  <div className="text-2xl">🟢</div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Visa, Mastercard, PayPal, Apple Pay, Google Pay
                </p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">You might also like</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Helmet Cleaner', price: 1999, emoji: '🧽' },
                  { name: 'Bike Cover', price: 4999, emoji: '🏍️' },
                  { name: 'Tool Kit', price: 2999, emoji: '🔧' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-md flex items-center justify-center">
                      <span className="text-xl">{item.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm font-bold">{formatPrice(item.price)}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Add
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}