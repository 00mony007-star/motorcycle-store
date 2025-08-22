// This file is updated to match the detailed domain models provided by the user.

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  image?: string
  parentId?: string
}

export interface Product {
  id: string
  slug: string
  title: string
  brand?: string
  category: Category // Changed from categoryId to the full object for convenience
  price: number
  compareAtPrice?: number
  stock: number
  rating: number
  reviewCount: number
  tags: string[]
  variants?: Variant[]
  images: string[]
  description: string
  shortDescription: string
  specs?: Record<string, string>
  features: string[]
  featured?: boolean
  createdAt: string // Using ISO string for dates for easier serialization
  updatedAt: string
}

export interface Variant {
  id: string
  name: string // e.g., "Color", "Size"
  options: string[] // e.g., ["Red", "Blue"], ["S", "M", "L"]
  sku?: string
  priceModifier?: number // e.g., +10 for a premium color
}

export interface CartItem {
  id: string // A unique ID for the cart item itself
  productId: string
  variantId?: string
  quantity: number
  price: number // The price at the time of adding to cart
  productSnapshot: { // Store key details to display in cart
    title: string
    image: string
    brand?: string
    variantInfo?: string // e.g., "Color: Red, Size: L"
  }
}

export interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  couponCode?: string
  discount?: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'customer' | 'admin'
  addresses?: Address[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  fullName: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export interface Order {
  id: string
  number: string
  userId?: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: 'USD' | 'EUR' | 'SAR' | string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled'
  payment: 'card' | 'paypal' | 'cod' | 'tabby' | 'applepay'
  shippingAddress: Address
  billingAddress: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  active: boolean
  startsAt?: string
  endsAt?: string
  appliesTo: 'all' | 'category' | 'product'
  targetId?: string
  usageLimit?: number
  used?: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title: string
  content: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
  user: {
    name: string
    avatar?: string
  }
}

export interface ContentBlock {
  id: string
  key: string
  title?: string
  body?: string
  media?: string[]
  link?: string
  active: boolean
}

export interface Settings {
    id: string;
    storeName: string;
    currency: 'USD' | 'EUR' | 'SAR';
    taxRate: number; // as a percentage, e.g., 8 for 8%
    shippingFlatRate: number;
    freeShippingThreshold: number;
}


// API and Search related types
export interface SearchFilters {
  category?: string
  brand?: string[]
  priceRange?: [number, number]
  inStock?: boolean
  rating?: number
  features?: string[]
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'
}

export interface SearchResult {
  products: Product[]
  total: number
  facets: {
    categories: Array<{ id: string; name: string; count: number }>
    brands: Array<{ name: string; count: number }>
    priceRange: { min: number; max: number }
    features: Array<{ name: string; count: number }>
  }
}

export interface APIResponse<T> {
  data: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
