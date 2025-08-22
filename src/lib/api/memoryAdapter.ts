import {
  ApiAdapter,
  ProductsAPI,
  CategoriesAPI,
  OrdersAPI,
  CouponsAPI,
  UsersAPI,
  ContentAPI,
} from './api.interfaces'
import { Product, Category, User, Order, CartItem, Coupon, ContentBlock } from '../types'
import { generateId, slugify } from '../utils'

// In-memory data stores
let products: Product[] = []
let categories: Category[] = []
let users: User[] = []
let orders: Order[] = []
let coupons: Coupon[] = []

// --- Products API Implementation ---
const productsMemoryAdapter: ProductsAPI = {
  async list(params = {}) {
    // Basic filtering and sorting for demo purposes
    let result = [...products]
    if (params.featured) {
      result = result.filter(p => p.featured)
    }
    if (params.sort === 'new') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    const offset = params.offset || 0
    const limit = params.limit || result.length
    return result.slice(offset, offset + limit)
  },
  async getById(id) {
    return products.find(p => p.id === id) || null
  },
  async getBySlug(slug) {
    return products.find(p => p.slug === slug) || null
  },
  async create(data) {
    const now = new Date().toISOString()
    const newProduct: Product = {
      ...data,
      id: generateId(),
      slug: slugify(data.title),
      createdAt: now,
      updatedAt: now,
    }
    products.push(newProduct)
    return newProduct
  },
  async update(id, data) {
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() }
    return products[index]
  },
  async remove(id) {
    products = products.filter(p => p.id !== id)
  },
}

// --- Users API Implementation ---
const usersMemoryAdapter: UsersAPI = {
  async login(email, password) {
    const user = users.find(u => u.email === email)
    if (user && password === 'password') {
      const token = `memory_token_${generateId()}`
      return { token, user }
    }
    throw new Error('Invalid credentials')
  },
  async register(userData) {
    if (users.some(u => u.email === userData.email)) {
      throw new Error('User already exists')
    }
    const now = new Date().toISOString()
    const newUser: User = { ...userData, id: generateId(), role: 'customer', createdAt: now, updatedAt: now }
    users.push(newUser)
    const token = `memory_token_${generateId()}`
    return { token, user: newUser }
  },
  async me() {
    // In a real memory adapter, you'd track the current user
    return users[0] || null
  },
  async logout() {
    // No-op for simple memory adapter
  },
}

// Other APIs can be implemented similarly...

export const memoryAdapter: ApiAdapter = {
  products: productsMemoryAdapter,
  users: usersMemoryAdapter,
  // Dummy implementations for others
  categories: { list: async () => categories } as CategoriesAPI,
  orders: { list: async () => orders } as OrdersAPI,
  coupons: { validate: async () => ({ valid: false, discount: 0 }) } as CouponsAPI,
  content: { get: async () => null } as ContentAPI,
}
