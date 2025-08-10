"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export function getSupabaseServer() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a no-op client substitute that throws on use, so we can gracefully
    // fall back to demo data elsewhere without crashing imports.
    return null as unknown as ReturnType<typeof createServerClient>
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {},
      remove() {},
    },
  })
}
