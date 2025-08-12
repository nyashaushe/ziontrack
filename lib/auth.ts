"use server"

import { getSupabaseServer } from "@/lib/supabase/server"

export type SessionUser = {
  id: string
  email: string | null
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServer()
  
  // Return null immediately if supabase client is unavailable
  if (!supabase) {
    // Log when Supabase configuration is missing for debugging purposes
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Debug] Supabase client unavailable - falling back to demo mode')
      console.log('[Auth Debug] Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables')
    }
    return null
  }
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    // Log authentication failures in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Debug] Authentication failed - falling back to demo mode', error?.message || 'No user data')
    }
    return null
  }
  
  // Log successful authentication in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth Debug] User authenticated successfully:', data.user.email || data.user.id)
  }
  
  return { id: data.user.id, email: data.user.email ?? null }
}
