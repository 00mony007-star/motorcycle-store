import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem, Product, Coupon } from '../types'
import { generateId, slugify } from '../utils'

interface CartState {
  cart: Cart | null
  addItem: (product: Product, selectedVariant?: { name: string; option: string }, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  clearCart: () => void
  calculateTotals: () => void
}

const getInitialCart = (): Cart => ({
  id: generateId(),
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,

      addItem: (product, selectedVariant, quantity = 1) => {
        const state = get()
        let cart = state.cart || getInitialCart()

        const variantIdPart = selectedVariant ? `-${slugify(selectedVariant.name)}-${slugify(selectedVariant.option)}` : ''
        const cartItemId = `${product.id}${variantIdPart}`

        const existingItemIndex = cart.items.findIndex(item => item.id === cartItemId)

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += quantity
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            quantity,
            price: product.price,
            productSnapshot: {
              title: product.title,
              image: product.images[0],
              brand: product.brand,
              variantInfo: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.option}` : undefined
            }
          }
          cart.items.push(newItem)
        }

        cart.updatedAt = new Date().toISOString()
        set({ cart })
        state.calculateTotals()
      },

      removeItem: (itemId) => {
        const state = get()
        if (!state.cart) return
        const cart = { ...state.cart }
        cart.items = cart.items.filter(item => item.id !== itemId)
        cart.updatedAt = new Date().toISOString()
        set({ cart })
        state.calculateTotals()
      },

      updateItemQuantity: (itemId, quantity) => {
        const state = get()
        if (!state.cart) return
        const cart = { ...state.cart }
        const itemIndex = cart.items.findIndex(item => item.id === itemId)
        if (itemIndex > -1) {
          if (quantity <= 0) {
            cart.items.splice(itemIndex, 1)
          } else {
            cart.items[itemIndex].quantity = quantity
          }
          cart.updatedAt = new Date().toISOString()
          set({ cart })
          state.calculateTotals()
        }
      },

      applyCoupon: (coupon) => {
        const state = get()
        if (!state.cart) return
        const cart = { ...state.cart }
        
        const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const discount = coupon.type === 'fixed' ? coupon.value : subtotal * (coupon.value / 100)

        cart.couponCode = coupon.code
        cart.discount = discount
        cart.updatedAt = new Date().toISOString()
        set({ cart })
        state.calculateTotals()
      },

      removeCoupon: () => {
        const state = get()
        if (!state.cart) return
        const cart = { ...state.cart }
        cart.couponCode = undefined
        cart.discount = undefined
        cart.updatedAt = new Date().toISOString()
        set({ cart })
        state.calculateTotals()
      },

      clearCart: () => {
        set({ cart: getInitialCart() })
      },
      
      calculateTotals: () => {
        const state = get()
        if (!state.cart) return
        const cart = { ...state.cart }

        cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        cart.tax = cart.subtotal * 0.08 // 8% tax
        cart.shipping = cart.subtotal > 100 ? 0 : 15 // Free shipping over $100
        
        let total = cart.subtotal + cart.tax + cart.shipping
        if (cart.discount) {
          total -= cart.discount
        }
        cart.total = Math.max(0, total)

        set({ cart })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
