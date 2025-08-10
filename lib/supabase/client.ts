"use client"

import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

let client: SupabaseClient | null = null

export function getSupabaseClient() {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  client = createBrowserClient(url, anon)
  return client
}
