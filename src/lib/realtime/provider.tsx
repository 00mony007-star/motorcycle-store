'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface RealtimeContextType {
  isConnected: boolean
  subscribe: (table: string, callback: (payload: RealtimePostgresChangesPayload<any>) => void) => () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

interface RealtimeProviderProps {
  children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const queryClient = useQueryClient()
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map())
  const isConnectedRef = useRef(false)

  const subscribe = (table: string, callback: (payload: RealtimePostgresChangesPayload<any>) => void) => {
    // If Supabase is not configured, return empty unsubscribe function
    if (!supabase) {
      console.warn(`Realtime subscription for ${table} skipped - Supabase not configured`)
      return () => {}
    }

    const channelName = `realtime:${table}`
    
    if (channelsRef.current.has(channelName)) {
      return () => {} // Already subscribed
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`Realtime update for ${table}:`, payload)
          callback(payload)
          
          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: [table] })
          
          // Show toast for important updates
          if (table === 'inventory' && payload.eventType === 'UPDATE') {
            const newData = payload.new as any
            const oldData = payload.old as any
            
            if (newData.stock <= newData.low_stock_threshold && oldData.stock > newData.low_stock_threshold) {
              toast({
                title: 'Low Stock Alert',
                description: `Product inventory is running low (${newData.stock} remaining)`,
                variant: 'destructive',
              })
            }
          }
          
          if (table === 'orders' && payload.eventType === 'INSERT') {
            toast({
              title: 'New Order',
              description: 'A new order has been placed',
            })
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status)
        isConnectedRef.current = status === 'SUBSCRIBED'
      })

    channelsRef.current.set(channelName, channel)

    return () => {
      const channel = channelsRef.current.get(channelName)
      if (channel && supabase) {
        supabase.removeChannel(channel)
        channelsRef.current.delete(channelName)
      }
    }
  }

  useEffect(() => {
    // Only subscribe if Supabase is configured
    if (!supabase) {
      console.warn('Realtime provider: Supabase not configured, skipping subscriptions')
      return
    }

    // Subscribe to critical tables for real-time updates
    const unsubscribers = [
      subscribe('products', (payload) => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product', payload.new?.slug] })
      }),
      
      subscribe('prices', (payload) => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
      }),
      
      subscribe('inventory', (payload) => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['inventory'] })
        queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] })
      }),
      
      subscribe('orders', (payload) => {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] })
      }),
      
      subscribe('reviews', (payload) => {
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
        queryClient.invalidateQueries({ queryKey: ['product', payload.new?.product_id] })
      }),
    ]

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [queryClient])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supabase) {
        channelsRef.current.forEach(channel => {
          supabase.removeChannel(channel)
        })
      }
      channelsRef.current.clear()
    }
  }, [])

  const contextValue: RealtimeContextType = {
    isConnected: isConnectedRef.current,
    subscribe,
  }

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  )
}