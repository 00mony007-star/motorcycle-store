import {
  ApiAdapter, ProductsAPI, CategoriesAPI, OrdersAPI, CouponsAPI, UsersAPI, ContentAPI, SettingsAPI
} from './api.interfaces'
import { getDB } from '../db'
import { Product, Category, User, Order, CartItem, Coupon, ContentBlock, Settings } from '../types'
import { generateId, slugify } from '../utils'

const productsAdapter: ProductsAPI = {
  async list(params = {}) {
    const db = await getDB()
    let products = await db.getAll('products')
    if (params.q) {
      const query = params.q.toLowerCase()
      products = products.filter(p => p.title.toLowerCase().includes(query) || p.brand?.toLowerCase().includes(query))
    }
    if (params.categoryId) products = products.filter(p => p.category.id === params.categoryId)
    if (params.tag) products = products.filter(p => p.tags.includes(params.tag!))
    if (params.featured) products = products.filter(p => p.featured)
    if (params.sort) {
      products.sort((a, b) => {
        switch (params.sort) {
          case 'price-asc': return a.price - b.price
          case 'price-desc': return b.price - a.price
          case 'rating': return b.rating - a.rating
          case 'new': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })
    }
    const offset = params.offset || 0
    const limit = params.limit || products.length
    return products.slice(offset, offset + limit)
  },
  async getById(id) { return (await getDB()).get('products', id) || null },
  async getBySlug(slug) { return (await getDB()).getFromIndex('products', 'by-slug', slug) || null },
  async create(data) {
    const db = await getDB()
    const now = new Date().toISOString()
    const newProduct: Product = { ...data, id: generateId(), slug: slugify(data.title), createdAt: now, updatedAt: now }
    await db.add('products', newProduct)
    return newProduct
  },
  async update(id, data) {
    const db = await getDB()
    const existing = await this.getById(id);
    if (!existing) throw new Error('Product not found')
    const updatedProduct: Product = { ...existing, ...data, slug: data.title ? slugify(data.title) : existing.slug, updatedAt: new Date().toISOString() }
    await db.put('products', updatedProduct)
    return updatedProduct
  },
  async remove(id) { await (await getDB()).delete('products', id) },
}

const categoriesAdapter: CategoriesAPI = {
  async list() { return (await getDB()).getAll('categories') },
  async getById(id) { return (await getDB()).get('categories', id) || null },
  async getBySlug(slug) { return (await getDB()).getFromIndex('categories', 'by-slug', slug) || null },
  async create(data) {
    const db = await getDB()
    const newCategory: Category = { ...data, id: generateId(), slug: slugify(data.name) }
    await db.add('categories', newCategory)
    return newCategory
  },
  async update(id, data) {
    const db = await getDB()
    const existing = await this.getById(id);
    if (!existing) throw new Error('Category not found')
    const updatedCategory: Category = { ...existing, ...data, slug: data.name ? slugify(data.name) : existing.slug }
    await db.put('categories', updatedCategory)
    return updatedCategory
  },
  async remove(id) { await (await getDB()).delete('categories', id) },
}

const usersAdapter: UsersAPI = {
  async login(email, password) {
    const user = await (await getDB()).getFromIndex('users', 'by-email', email)
    if (!user || password !== 'password') throw new Error('Invalid credentials')
    const token = `mock_token_${generateId()}`
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user_id', user.id)
    return { token, user }
  },
  async register(userData) {
    const db = await getDB()
    if (await db.getFromIndex('users', 'by-email', userData.email)) throw new Error('User with this email already exists')
    const now = new Date().toISOString()
    const newUser: User = { ...userData, id: generateId(), role: 'customer', createdAt: now, updatedAt: now }
    await db.add('users', newUser)
    return this.login(userData.email, userData.password)
  },
  async me() {
    const userId = localStorage.getItem('current_user_id')
    return userId ? (await (await getDB()).get('users', userId)) || null : null
  },
  async logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user_id')
  },
}

const ordersAdapter: OrdersAPI = {
  async list(userId) {
    const db = await getDB()
    return userId ? db.getAllFromIndex('orders', 'by-userId', userId) : db.getAll('orders')
  },
  async get(id) { return (await getDB()).get('orders', id) || null },
  async create(orderData) {
    const db = await getDB()
    const now = new Date().toISOString()
    const newOrder: Order = { ...orderData, id: generateId(), number: `MG-${Date.now()}`, status: 'pending', createdAt: now, updatedAt: now }
    await db.add('orders', newOrder)
    return newOrder
  },
  async update(id, data) {
    const db = await getDB()
    const existing = await this.get(id);
    if (!existing) throw new Error('Order not found')
    const updatedOrder: Order = { ...existing, ...data, updatedAt: new Date().toISOString() }
    await db.put('orders', updatedOrder)
    return updatedOrder
  },
}

const couponsAdapter: CouponsAPI = {
    async list() { return (await getDB()).getAll('coupons') },
    async get(id) { return (await getDB()).get('coupons', id) || null },
    async getByCode(code) { return (await getDB()).getFromIndex('coupons', 'by-code', code.toUpperCase()) || null },
    async create(data) {
        const db = await getDB();
        const newCoupon: Coupon = { ...data, id: generateId() };
        await db.add('coupons', newCoupon);
        return newCoupon;
    },
    async update(id, data) {
        const db = await getDB();
        const existing = await this.get(id);
        if (!existing) throw new Error('Coupon not found');
        const updatedCoupon: Coupon = { ...existing, ...data };
        await db.put('coupons', updatedCoupon);
        return updatedCoupon;
    },
    async remove(id) { await (await getDB()).delete('coupons', id) },
    async validate(code, cart) {
        const coupon = await this.getByCode(code);
        if (!coupon || !coupon.active) return { valid: false, discount: 0, reason: "Invalid or expired coupon." };
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = coupon.type === 'fixed' ? coupon.value : subtotal * (coupon.value / 100);
        return { valid: true, discount };
    }
};

const contentAdapter: ContentAPI = {
  async list() { return (await getDB()).getAll('contentBlocks') },
  async get(key) { return (await getDB()).getFromIndex('contentBlocks', 'by-key', key) || null },
  async create(data) {
    const db = await getDB();
    const newBlock: ContentBlock = { ...data, id: generateId() };
    await db.add('contentBlocks', newBlock);
    return newBlock;
  },
  async update(id, data) {
    const db = await getDB();
    const existing = await db.get('contentBlocks', id);
    if (!existing) throw new Error('Content block not found');
    const updatedBlock: ContentBlock = { ...existing, ...data };
    await db.put('contentBlocks', updatedBlock);
    return updatedBlock;
  },
  async remove(id) { await (await getDB()).delete('contentBlocks', id) },
}

const settingsAdapter: SettingsAPI = {
    async get() {
        const db = await getDB();
        const settings = await db.getAll('settings');
        return settings[0] || null;
    },
    async update(data) {
        const db = await getDB();
        const existing = await this.get();
        if (!existing) throw new Error('Settings not found');
        const updatedSettings: Settings = { ...existing, ...data };
        await db.put('settings', updatedSettings);
        return updatedSettings;
    }
}

export const indexedDbAdapter: ApiAdapter = {
  products: productsAdapter,
  categories: categoriesAdapter,
  users: usersAdapter,
  orders: ordersAdapter,
  coupons: couponsAdapter,
  content: contentAdapter,
  settings: settingsAdapter,
}
