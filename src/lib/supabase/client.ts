import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables not configured. Some features will be disabled.')
    return null
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

export const supabase = createClient()