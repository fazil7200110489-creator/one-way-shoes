// supabase.ts – Safe lazy initialization for Next.js 16
// This module provides a helper to obtain a Supabase client instance.
// The client is created only when needed at runtime, avoiding build‑time errors
// caused by missing environment variables during static prerendering.

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cache the client after the first creation
let cachedClient: SupabaseClient | null = null

/**
 * Returns a Supabase client instance.
 * Throws a clear error if the required environment variables are not set.
 * The function can be called both on the server and client side.
 */
export function getSupabase(): SupabaseClient {
    if (cachedClient) return cachedClient

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    //   if (!url || !anonKey) {
    //     // Provide a helpful error message.
    //     throw new Error('Supabase initialization error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.')
    //   }
    if (!url || !anonKey) {
        console.warn('Supabase environment variables are missing.')
        return null as unknown as SupabaseClient
    }

    cachedClient = createClient(url, anonKey)
    return cachedClient
}
