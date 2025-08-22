import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '../../lib/stores/cartStore'
import { Button } from './Button'
import { Badge } from './Badge'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cart, updateItemQuantity, removeItem } = useCartStore()
  const { t } = useTranslation()
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set())

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const subtotal = cart?.subtotal || 0

  // Animate items when quantity changes
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setAnimatedItems(prev => new Set([...prev, itemId]))
    updateItemQuantity(itemId, newQuantity)
    
    // Remove animation after delay
    setTimeout(() => {
      setAnimatedItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }, 300)
  }

  const handleRemoveItem = (itemId: string) => {
    setAnimatedItems(prev => new Set([...prev, itemId]))
    setTimeout(() => removeItem(itemId), 200)
  }

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

          {/* Mini Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-premium"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">{t('cart.title', 'Shopping Cart')}</h2>
                  {cartItemCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {cartItemCount}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="focus-ring"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart?.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('cart.empty.title', 'Your cart is empty')}</h3>
                    <p className="text-muted-foreground mb-4">{t('cart.empty.description', 'Add some awesome gear to get started!')}</p>
                    <Button asChild onClick={onClose}>
                      <Link to="/category/all">
                        {t('cart.empty.cta', 'Start Shopping')}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {cart?.items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            scale: animatedItems.has(item.id) ? 1.05 : 1
                          }}
                          exit={{ opacity: 0, x: 100, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.productSnapshot.image}
                              alt={item.productSnapshot.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">
                              {item.productSnapshot.title}
                            </h4>
                            {item.productSnapshot.brand && (
                              <p className="text-xs text-muted-foreground">
                                {item.productSnapshot.brand}
                              </p>
                            )}
                            {item.productSnapshot.variantInfo && (
                              <p className="text-xs text-muted-foreground">
                                {item.productSnapshot.variantInfo}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-primary">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="w-8 text-center text-sm font-medium"
                            >
                              {item.quantity}
                            </motion.span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart?.items.length > 0 && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">{t('cart.subtotal', 'Subtotal')}</span>
                    <motion.span 
                      key={subtotal}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold text-primary"
                    >
                      ${subtotal.toFixed(2)}
                    </motion.span>
                  </div>

                  {/* Free Shipping Indicator */}
                  {subtotal < 100 && (
                    <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded-md">
                      {t('cart.freeShipping', `Add $${(100 - subtotal).toFixed(2)} more for free shipping!`)}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      asChild 
                      className="w-full btn-premium"
                      onClick={onClose}
                    >
                      <Link to="/checkout" className="flex items-center justify-center space-x-2">
                        <span>{t('cart.checkout', 'Checkout')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full"
                      onClick={onClose}
                    >
                      <Link to="/cart">
                        {t('cart.viewCart', 'View Cart')}
                      </Link>
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

// Cart toggle button for header
export function MiniCartToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart } = useCartStore()
  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative focus-ring"
        aria-label={`Shopping cart with ${cartItemCount} items`}
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2"
          >
            <Badge 
              variant="destructive" 
              className="w-5 h-5 p-0 flex items-center justify-center text-xs animate-bounce-subtle"
            >
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Badge>
          </motion.div>
        )}
      </Button>
      
      <MiniCart isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}