export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          id: string
          actor_id: string | null
          table_name: string
          row_id: string
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data: Json | null
          new_data: Json | null
          diff: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          table_name: string
          row_id: string
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          diff?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          table_name?: string
          row_id?: string
          action?: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          diff?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          description: string | null
          website_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          description?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          description?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          items: Json
          coupon_code: string | null
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          items?: Json
          coupon_code?: string | null
          updated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          items?: Json
          coupon_code?: string | null
          updated_at?: string
          expires_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          sku: string | null
          stock: number
          low_stock_threshold: number
          track_inventory: boolean
          allow_backorder: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku?: string | null
          stock?: number
          low_stock_threshold?: number
          track_inventory?: boolean
          allow_backorder?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string | null
          stock?: number
          low_stock_threshold?: number
          track_inventory?: boolean
          allow_backorder?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          currency: string
          subtotal_cents: number
          tax_cents: number
          shipping_cents: number
          discount_cents: number
          total_cents: number
          line_items: Json
          shipping_address: Json | null
          billing_address: Json | null
          payment_method: Json | null
          payment_intent_id: string | null
          notes: string | null
          fulfilled_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          currency?: string
          subtotal_cents: number
          tax_cents?: number
          shipping_cents?: number
          discount_cents?: number
          total_cents: number
          line_items: Json
          shipping_address?: Json | null
          billing_address?: Json | null
          payment_method?: Json | null
          payment_intent_id?: string | null
          notes?: string | null
          fulfilled_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          currency?: string
          subtotal_cents?: number
          tax_cents?: number
          shipping_cents?: number
          discount_cents?: number
          total_cents?: number
          line_items?: Json
          shipping_address?: Json | null
          billing_address?: Json | null
          payment_method?: Json | null
          payment_intent_id?: string | null
          notes?: string | null
          fulfilled_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prices: {
        Row: {
          id: string
          product_id: string
          currency: string
          amount_cents: number
          compare_at_cents: number | null
          starts_at: string
          ends_at: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          currency?: string
          amount_cents: number
          compare_at_cents?: number | null
          starts_at?: string
          ends_at?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          currency?: string
          amount_cents?: number
          compare_at_cents?: number | null
          starts_at?: string
          ends_at?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_media: {
        Row: {
          id: string
          product_id: string
          url: string
          type: string
          alt_text: string | null
          sort_order: number
          width: number | null
          height: number | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          type?: string
          alt_text?: string | null
          sort_order?: number
          width?: number | null
          height?: number | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          type?: string
          alt_text?: string | null
          sort_order?: number
          width?: number | null
          height?: number | null
          file_size?: number | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          short_description: string | null
          brand_id: string | null
          category_id: string
          specs: Json
          features: string[]
          tags: string[]
          active: boolean
          featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          short_description?: string | null
          brand_id?: string | null
          category_id: string
          specs?: Json
          features?: string[]
          tags?: string[]
          active?: boolean
          featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          short_description?: string | null
          brand_id?: string | null
          category_id?: string
          specs?: Json
          features?: string[]
          tags?: string[]
          active?: boolean
          featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
      }
      promotions: {
        Row: {
          id: string
          name: string
          code: string | null
          type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
          value: number
          minimum_amount_cents: number
          maximum_discount_cents: number | null
          usage_limit: number | null
          usage_count: number
          applies_to: Json
          starts_at: string
          ends_at: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code?: string | null
          type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
          value: number
          minimum_amount_cents?: number
          maximum_discount_cents?: number | null
          usage_limit?: number | null
          usage_count?: number
          applies_to?: Json
          starts_at?: string
          ends_at?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          type?: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
          value?: number
          minimum_amount_cents?: number
          maximum_discount_cents?: number | null
          usage_limit?: number | null
          usage_count?: number
          applies_to?: Json
          starts_at?: string
          ends_at?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id: string | null
          rating: number
          title: string | null
          body: string | null
          verified_purchase: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          body?: string | null
          verified_purchase?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          body?: string | null
          verified_purchase?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          user_id: string
          role: 'admin' | 'staff' | 'customer'
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          role?: 'admin' | 'staff' | 'customer'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          role?: 'admin' | 'staff' | 'customer'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      products_with_details: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          short_description: string | null
          brand_id: string | null
          category_id: string
          specs: Json
          features: string[]
          tags: string[]
          active: boolean
          featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
          brand_name: string | null
          brand_logo: string | null
          category_name: string | null
          category_slug: string | null
          amount_cents: number | null
          compare_at_cents: number | null
          currency: string | null
          stock: number | null
          low_stock_threshold: number | null
          sku: string | null
          avg_rating: number | null
          review_count: number | null
          media: Json | null
        }
      }
      analytics_daily: {
        Row: {
          date: string
          order_count: number
          revenue_cents: number
          avg_order_value_cents: number
          unique_customers: number
        }
      }
    }
    Functions: {
      update_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_audit_log: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: 'admin' | 'staff' | 'customer'
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      promotion_type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
      audit_action: 'INSERT' | 'UPDATE' | 'DELETE'
    }
  }
}