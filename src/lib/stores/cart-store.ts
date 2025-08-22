import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { CartItem, Product } from '@/lib/types'
import { calculateShipping, calculateTax } from '@/lib/utils'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  couponCode?: string
  
  // Computed values
  subtotalCents: number
  taxCents: number
  shippingCents: number
  discountCents: number
  totalCents: number
  itemCount: number
  
  // Actions
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  toggleCart: () => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
  
  // Private methods
  _calculateTotals: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,
      couponCode: undefined,
      subtotalCents: 0,
      taxCents: 0,
      shippingCents: 0,
      discountCents: 0,
      totalCents: 0,
      itemCount: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product_id === product.id)
          
          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            const priceInCents = product.price?.amount_cents || 0
            state.items.push({
              product_id: product.id,
              quantity,
              price_cents: priceInCents,
              product_snapshot: {
                title: product.title,
                image_url: product.media?.[0]?.url,
                slug: product.slug,
                brand_name: product.brand?.name,
              },
            })
          }
          
          state._calculateTotals()
        })
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            state.items = state.items.filter(item => item.product_id !== productId)
          } else {
            const item = state.items.find(item => item.product_id === productId)
            if (item) {
              item.quantity = quantity
            }
          }
          
          state._calculateTotals()
        })
      },

      removeItem: (productId) => {
        set((state) => {
          state.items = state.items.filter(item => item.product_id !== productId)
          state._calculateTotals()
        })
      },

      clearCart: () => {
        set((state) => {
          state.items = []
          state.couponCode = undefined
          state._calculateTotals()
        })
      },

      toggleCart: () => {
        set((state) => {
          state.isOpen = !state.isOpen
        })
      },

      applyCoupon: (code) => {
        set((state) => {
          state.couponCode = code
          // TODO: Validate coupon and calculate discount
          state.discountCents = 0 // Placeholder
          state._calculateTotals()
        })
      },

      removeCoupon: () => {
        set((state) => {
          state.couponCode = undefined
          state.discountCents = 0
          state._calculateTotals()
        })
      },

      _calculateTotals: () => {
        set((state) => {
          const subtotal = state.items.reduce(
            (sum, item) => sum + item.price_cents * item.quantity,
            0
          )
          
          const shipping = calculateShipping(subtotal)
          const tax = calculateTax(subtotal)
          const total = subtotal + tax + shipping - state.discountCents
          
          state.subtotalCents = subtotal
          state.taxCents = tax
          state.shippingCents = shipping
          state.totalCents = Math.max(0, total)
          state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
        })
      },
    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._calculateTotals()
        }
      },
    }
  )
)