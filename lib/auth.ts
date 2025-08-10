"use server"

import { getSupabaseServer } from "@/lib/supabase/server"

export type SessionUser = {
  id: string
  email: string | null
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = getSupabaseServer()
  if (!supabase) return null
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
}
