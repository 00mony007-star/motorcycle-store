import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import { Product, Order, User, Category } from './types'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database table names
export const TABLES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories', 
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  USERS: 'users',
  REVIEWS: 'reviews',
  COUPONS: 'coupons',
  INVENTORY_LOGS: 'inventory_logs'
} as const

// Real-time subscription manager
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map()
  private subscribers: Map<string, Set<(payload: any) => void>> = new Map()

  // Subscribe to product changes
  subscribeToProducts(callback: (payload: any) => void) {
    const channelName = 'products-channel'
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: TABLES.PRODUCTS
        }, callback)
        .subscribe()
      
      this.channels.set(channelName, channel)
    }

    // Add callback to subscribers
    if (!this.subscribers.has(channelName)) {
      this.subscribers.set(channelName, new Set())
    }
    this.subscribers.get(channelName)?.add(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(channelName)?.delete(callback)
      if (this.subscribers.get(channelName)?.size === 0) {
        this.channels.get(channelName)?.unsubscribe()
        this.channels.delete(channelName)
        this.subscribers.delete(channelName)
      }
    }
  }

  // Subscribe to order changes
  subscribeToOrders(callback: (payload: any) => void) {
    const channelName = 'orders-channel'
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: TABLES.ORDERS
        }, callback)
        .subscribe()
      
      this.channels.set(channelName, channel)
    }

    if (!this.subscribers.has(channelName)) {
      this.subscribers.set(channelName, new Set())
    }
    this.subscribers.get(channelName)?.add(callback)

    return () => {
      this.subscribers.get(channelName)?.delete(callback)
      if (this.subscribers.get(channelName)?.size === 0) {
        this.channels.get(channelName)?.unsubscribe()
        this.channels.delete(channelName)
        this.subscribers.delete(channelName)
      }
    }
  }

  // Subscribe to inventory changes
  subscribeToInventory(callback: (payload: any) => void) {
    const channelName = 'inventory-channel'
    
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: TABLES.PRODUCTS,
          filter: 'stock=neq.null'
        }, callback)
        .subscribe()
      
      this.channels.set(channelName, channel)
    }

    if (!this.subscribers.has(channelName)) {
      this.subscribers.set(channelName, new Set())
    }
    this.subscribers.get(channelName)?.add(callback)

    return () => {
      this.subscribers.get(channelName)?.delete(callback)
      if (this.subscribers.get(channelName)?.size === 0) {
        this.channels.get(channelName)?.unsubscribe()
        this.channels.delete(channelName)
        this.subscribers.delete(channelName)
      }
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.channels.forEach(channel => channel.unsubscribe())
    this.channels.clear()
    this.subscribers.clear()
  }
}

export const realtimeManager = new RealtimeManager()

// Database operations
export class SupabaseAPI {
  // Products
  async getProducts(filters?: {
    categoryId?: string
    featured?: boolean
    limit?: number
    offset?: number
    search?: string
    sort?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'popular'
  }) {
    let query = supabase
      .from(TABLES.PRODUCTS)
      .select(`
        *,
        category:categories(*)
      `)

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters?.featured) {
      query = query.eq('featured', true)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'popular':
          query = query.order('review_count', { ascending: false })
          break
      }
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Product[]
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select(`
        *,
        category:categories(*),
        reviews:reviews(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Product
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  }

  async updateProductStock(productId: string, newStock: number) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update({ 
        stock: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error

    // Log inventory change
    await supabase
      .from(TABLES.INVENTORY_LOGS)
      .insert({
        product_id: productId,
        old_stock: data.stock,
        new_stock: newStock,
        change_type: 'manual_update',
        created_at: new Date().toISOString()
      })

    return data as Product
  }

  // Orders
  async getOrders(filters?: {
    userId?: string
    status?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from(TABLES.ORDERS)
      .select(`
        *,
        order_items:order_items(*),
        user:users(*)
      `)

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data as Order[]
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .insert({
        ...order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data as Order
  }

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data as Order
  }

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .order('name')

    if (error) throw error
    return data as Category[]
  }

  // File uploads
  async uploadFile(file: File, bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return urlData.publicUrl
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  // Bulk operations
  async bulkInsertProducts(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert(products.map(product => ({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select()

    if (error) throw error
    return data as Product[]
  }

  // Analytics
  async getAnalytics(dateRange: { from: string; to: string }) {
    const { data: orders, error: ordersError } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .gte('created_at', dateRange.from)
      .lte('created_at', dateRange.to)

    if (ordersError) throw ordersError

    const { data: products, error: productsError } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')

    if (productsError) throw productsError

    return {
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
      topProducts: products.sort((a, b) => b.review_count - a.review_count).slice(0, 5),
      lowStockProducts: products.filter(p => p.stock <= 5)
    }
  }
}

export const supabaseAPI = new SupabaseAPI()

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signInWithProvider(provider: 'google' | 'github' | 'apple') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Storage helpers
export const storage = {
  async uploadProductImage(file: File, productId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  },

  async deleteProductImage(url: string) {
    // Extract path from URL
    const path = url.split('/').slice(-2).join('/')
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([path])

    if (error) throw error
  }
}

// Real-time hooks for React components
export function useRealtimeProducts() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Initial load
    supabaseAPI.getProducts().then(data => {
      setProducts(data)
      setIsLoading(false)
    })

    // Subscribe to changes
    const unsubscribe = realtimeManager.subscribeToProducts((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload
      
      setProducts(current => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord as Product]
          case 'UPDATE':
            return current.map(p => p.id === newRecord.id ? newRecord as Product : p)
          case 'DELETE':
            return current.filter(p => p.id !== oldRecord.id)
          default:
            return current
        }
      })
    })

    return unsubscribe
  }, [])

  return { products, isLoading }
}

export function useRealtimeOrders() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Initial load
    supabaseAPI.getOrders().then(data => {
      setOrders(data)
      setIsLoading(false)
    })

    // Subscribe to changes
    const unsubscribe = realtimeManager.subscribeToOrders((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload
      
      setOrders(current => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord as Order, ...current]
          case 'UPDATE':
            return current.map(o => o.id === newRecord.id ? newRecord as Order : o)
          case 'DELETE':
            return current.filter(o => o.id !== oldRecord.id)
          default:
            return current
        }
      })
    })

    return unsubscribe
  }, [])

  return { orders, isLoading }
}

// Database schema setup (run once)
export async function setupDatabase() {
  // This would typically be done via Supabase migrations
  // Here's the SQL schema for reference:
  
  const schema = `
    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR NOT NULL,
      slug VARCHAR UNIQUE NOT NULL,
      description TEXT,
      image VARCHAR,
      parent_id UUID REFERENCES categories(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR NOT NULL,
      slug VARCHAR UNIQUE NOT NULL,
      brand VARCHAR,
      category_id UUID REFERENCES categories(id) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      compare_at_price DECIMAL(10,2),
      stock INTEGER DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      tags TEXT[],
      images TEXT[],
      description TEXT,
      short_description TEXT,
      specs JSONB,
      features TEXT[],
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      status VARCHAR DEFAULT 'pending',
      subtotal DECIMAL(10,2) NOT NULL,
      tax DECIMAL(10,2) DEFAULT 0,
      shipping DECIMAL(10,2) DEFAULT 0,
      discount DECIMAL(10,2) DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      shipping_address JSONB,
      billing_address JSONB,
      payment_method JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Order items table
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      product_snapshot JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Inventory logs table
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID REFERENCES products(id),
      old_stock INTEGER,
      new_stock INTEGER,
      change_type VARCHAR NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Reviews table
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR,
      content TEXT,
      verified_purchase BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable Row Level Security
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

    -- RLS Policies (basic examples)
    CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
    CREATE POLICY "Orders are viewable by owner" ON orders FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
  `

  console.log('Database schema:', schema)
  // In a real app, this would be executed via Supabase migrations
}