import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Product, Order, User } from '../types'

interface RealtimeEvent {
  type: 'product_updated' | 'product_created' | 'product_deleted' | 
        'order_created' | 'order_updated' | 'stock_updated' | 
        'user_activity' | 'admin_notification'
  payload: any
  timestamp: string
  userId?: string
}

interface RealtimeState {
  // Connection state
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastPingTime: number | null
  
  // Real-time data
  liveProducts: Map<string, Product>
  liveOrders: Map<string, Order>
  activeUsers: Set<string>
  
  // Optimistic updates
  pendingUpdates: Map<string, any>
  
  // Actions
  connect: () => void
  disconnect: () => void
  handleRealtimeEvent: (event: RealtimeEvent) => void
  addOptimisticUpdate: (id: string, update: any) => void
  removeOptimisticUpdate: (id: string) => void
  
  // Product updates
  updateProductStock: (productId: string, newStock: number) => void
  updateProductPrice: (productId: string, newPrice: number) => void
  
  // Admin notifications
  notifications: Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
  addNotification: (notification: Omit<RealtimeState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

// WebSocket connection manager
class RealtimeManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pingInterval: NodeJS.Timeout | null = null
  
  connect(onMessage: (event: RealtimeEvent) => void, onStatusChange: (status: RealtimeState['connectionStatus']) => void) {
    try {
      // For development, we'll simulate WebSocket with a mock connection
      // In production, replace with actual WebSocket URL
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
      
      onStatusChange('connecting')
      
      // Simulate connection for demo
      setTimeout(() => {
        onStatusChange('connected')
        this.startPing(onStatusChange)
        
        // Simulate some real-time events for demo
        this.simulateRealtimeEvents(onMessage)
      }, 1000)
      
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      onStatusChange('error')
      this.scheduleReconnect(onMessage, onStatusChange)
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
    
    this.reconnectAttempts = 0
  }
  
  private startPing(onStatusChange: (status: RealtimeState['connectionStatus']) => void) {
    this.pingInterval = setInterval(() => {
      // Simulate ping/pong for connection health
      onStatusChange('connected')
    }, 30000)
  }
  
  private scheduleReconnect(onMessage: (event: RealtimeEvent) => void, onStatusChange: (status: RealtimeState['connectionStatus']) => void) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      onStatusChange('error')
      return
    }
    
    setTimeout(() => {
      this.reconnectAttempts++
      this.connect(onMessage, onStatusChange)
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
  }
  
  private simulateRealtimeEvents(onMessage: (event: RealtimeEvent) => void) {
    // Simulate periodic stock updates
    setInterval(() => {
      const event: RealtimeEvent = {
        type: 'stock_updated',
        payload: {
          productId: 'demo-product-1',
          newStock: Math.floor(Math.random() * 50) + 1
        },
        timestamp: new Date().toISOString()
      }
      onMessage(event)
    }, 10000)
    
    // Simulate new orders
    setInterval(() => {
      const event: RealtimeEvent = {
        type: 'order_created',
        payload: {
          orderId: `order-${Date.now()}`,
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          total: Math.floor(Math.random() * 500) + 50
        },
        timestamp: new Date().toISOString()
      }
      onMessage(event)
    }, 15000)
  }
  
  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }
}

const realtimeManager = new RealtimeManager()

export const useRealtimeStore = create<RealtimeState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    lastPingTime: null,
    liveProducts: new Map(),
    liveOrders: new Map(),
    activeUsers: new Set(),
    pendingUpdates: new Map(),
    notifications: [],

    // Connection management
    connect: () => {
      const state = get()
      if (state.isConnected) return

      realtimeManager.connect(
        (event) => state.handleRealtimeEvent(event),
        (status) => set({ 
          connectionStatus: status,
          isConnected: status === 'connected',
          lastPingTime: status === 'connected' ? Date.now() : null
        })
      )
    },

    disconnect: () => {
      realtimeManager.disconnect()
      set({ 
        isConnected: false, 
        connectionStatus: 'disconnected',
        lastPingTime: null
      })
    },

    // Event handling
    handleRealtimeEvent: (event: RealtimeEvent) => {
      const state = get()
      
      switch (event.type) {
        case 'product_updated':
          const updatedProduct = event.payload as Product
          set({
            liveProducts: new Map(state.liveProducts.set(updatedProduct.id, updatedProduct))
          })
          break
          
        case 'stock_updated':
          const { productId, newStock } = event.payload
          const existingProduct = state.liveProducts.get(productId)
          if (existingProduct) {
            const updatedProd = { ...existingProduct, stock: newStock }
            set({
              liveProducts: new Map(state.liveProducts.set(productId, updatedProd))
            })
          }
          
          // Show notification for low stock
          if (newStock <= 5) {
            state.addNotification({
              type: 'warning',
              title: 'Low Stock Alert',
              message: `Product ${productId} is running low (${newStock} remaining)`
            })
          }
          break
          
        case 'order_created':
          const newOrder = event.payload as Order
          set({
            liveOrders: new Map(state.liveOrders.set(newOrder.id, newOrder))
          })
          
          state.addNotification({
            type: 'success',
            title: 'New Order',
            message: `Order ${newOrder.id} received - $${newOrder.total}`
          })
          break
          
        case 'user_activity':
          const { userId } = event.payload
          set({
            activeUsers: new Set([...state.activeUsers, userId])
          })
          break
          
        default:
          console.log('Unhandled realtime event:', event)
      }
    },

    // Optimistic updates
    addOptimisticUpdate: (id: string, update: any) => {
      const state = get()
      set({
        pendingUpdates: new Map(state.pendingUpdates.set(id, update))
      })
    },

    removeOptimisticUpdate: (id: string) => {
      const state = get()
      const newUpdates = new Map(state.pendingUpdates)
      newUpdates.delete(id)
      set({ pendingUpdates: newUpdates })
    },

    // Product operations
    updateProductStock: (productId: string, newStock: number) => {
      const state = get()
      
      // Optimistic update
      state.addOptimisticUpdate(productId, { stock: newStock })
      
      // Send to server (simulate)
      setTimeout(() => {
        state.removeOptimisticUpdate(productId)
        
        // Simulate server response
        const event: RealtimeEvent = {
          type: 'stock_updated',
          payload: { productId, newStock },
          timestamp: new Date().toISOString()
        }
        state.handleRealtimeEvent(event)
      }, 500)
    },

    updateProductPrice: (productId: string, newPrice: number) => {
      const state = get()
      
      // Optimistic update
      state.addOptimisticUpdate(productId, { price: newPrice })
      
      // Send to server (simulate)
      setTimeout(() => {
        state.removeOptimisticUpdate(productId)
        
        const existingProduct = state.liveProducts.get(productId)
        if (existingProduct) {
          const updatedProduct = { ...existingProduct, price: newPrice }
          const event: RealtimeEvent = {
            type: 'product_updated',
            payload: updatedProduct,
            timestamp: new Date().toISOString()
          }
          state.handleRealtimeEvent(event)
        }
      }, 500)
    },

    // Notifications
    addNotification: (notification) => {
      const state = get()
      const newNotification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false
      }
      
      set({
        notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep last 50
      })
    },

    markNotificationRead: (id: string) => {
      const state = get()
      set({
        notifications: state.notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      })
    },

    clearNotifications: () => {
      set({ notifications: [] })
    }
  }))
)

// Hook for using realtime updates in components
export function useRealtimeUpdates() {
  const store = useRealtimeStore()
  
  React.useEffect(() => {
    store.connect()
    
    return () => {
      store.disconnect()
    }
  }, [])
  
  return {
    isConnected: store.isConnected,
    connectionStatus: store.connectionStatus,
    liveProducts: store.liveProducts,
    liveOrders: store.liveOrders,
    notifications: store.notifications,
    markNotificationRead: store.markNotificationRead
  }
}