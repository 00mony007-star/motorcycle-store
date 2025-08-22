'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    items, 
    itemCount, 
    subtotalCents, 
    taxCents, 
    shippingCents, 
    totalCents,
    updateQuantity,
    removeItem,
    clearCart
  } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  {itemCount > 0 && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                      {itemCount}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">Add some awesome gear to get started!</p>
                    <Button asChild onClick={onClose}>
                      <Link href="/catalog">
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.product_id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-border"
                      >
                        {/* Product Image Placeholder */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md flex items-center justify-center">
                          <span className="text-white text-xl">🏍️</span>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.product_snapshot.title}
                          </h4>
                          {item.product_snapshot.brand_name && (
                            <p className="text-xs text-muted-foreground">
                              {item.product_snapshot.brand_name}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-orange-500">
                            {formatPrice(item.price_cents)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-8 h-8"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product_id)}
                          className="w-8 h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotalCents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(taxCents)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-orange-500">{formatPrice(totalCents)}</span>
                    </div>
                  </div>

                  {/* Free Shipping Progress */}
                  {subtotalCents < 10000 && (
                    <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded-md">
                      Add {formatPrice(10000 - subtotalCents)} more for free shipping!
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600" onClick={onClose}>
                      <Link href="/checkout">
                        Checkout
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full" onClick={onClose}>
                      <Link href="/cart">
                        View Cart
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearCart}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}