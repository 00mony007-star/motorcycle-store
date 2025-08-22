import { Product, Category, User, Order, CartItem, Coupon, ContentBlock, Settings } from '../types'

export interface ProductsAPI {
  list(params?: {
    q?: string
    categoryId?: string
    tag?: string
    sort?: 'new' | 'price-asc' | 'price-desc' | 'rating'
    featured?: boolean
    limit?: number
    offset?: number
  }): Promise<Product[]>
  getById(id: string): Promise<Product | null>
  getBySlug(slug: string): Promise<Product | null>
  create(data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Product>
  update(id: string, data: Partial<Product>): Promise<Product>
  remove(id: string): Promise<void>
}

export interface CategoriesAPI {
  list(): Promise<Category[]>
  getById(id: string): Promise<Category | null>
  getBySlug(slug: string): Promise<Category | null>
  create(data: Omit<Category, 'id' | 'slug'>): Promise<Category>
  update(id: string, data: Partial<Category>): Promise<Category>
  remove(id: string): Promise<void>
}

export interface OrdersAPI {
  list(userId?: string): Promise<Order[]>
  get(id: string): Promise<Order | null>
  create(orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order>
  update(id: string, data: Partial<Order>): Promise<Order>
}

export interface CouponsAPI {
  list(): Promise<Coupon[]>
  get(id: string): Promise<Coupon | null>
  getByCode(code: string): Promise<Coupon | null>
  create(data: Omit<Coupon, 'id'>): Promise<Coupon>
  update(id: string, data: Partial<Coupon>): Promise<Coupon>
  remove(id: string): Promise<void>
  validate(code: string, cart: CartItem[]): Promise<{ valid: boolean; discount: number; reason?: string }>
}

export interface UsersAPI {
  login(email: string, password: string): Promise<{ token: string; user: User }>
  register(userData: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt' | 'addresses'> & { password: string }): Promise<{ token: string; user: User }>
  me(): Promise<User | null>
  logout(): Promise<void>
}

export interface ContentAPI {
  list(): Promise<ContentBlock[]>
  get(key: string): Promise<ContentBlock | null>
  create(data: Omit<ContentBlock, 'id'>): Promise<ContentBlock>
  update(id: string, data: Partial<ContentBlock>): Promise<ContentBlock>
  remove(id: string): Promise<void>
}

export interface SettingsAPI {
    get(): Promise<Settings | null>
    update(data: Partial<Settings>): Promise<Settings>
}

export interface ApiAdapter {
  products: ProductsAPI
  categories: CategoriesAPI
  orders: OrdersAPI
  coupons: CouponsAPI
  users: UsersAPI
  content: ContentAPI
  settings: SettingsAPI
}
