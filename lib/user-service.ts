"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { getSessionUser } from "./auth"
import type { UserRole } from "@/types/user"

export type CurrentUser = {
  id: string
  name: string
  email: string | null
  role: UserRole
  units: { id: string }[]
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = getSupabaseServer()
  const sessionUser = await getSessionUser()
  if (!supabase || !sessionUser) {
    // Graceful fallback to viewer when not configured or not signed in
    return {
      id: "demo-user",
      name: "Demo User",
      email: null,
      role: "viewer",
      units: [],
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      unit:units(id, name)
    `)
    .eq("id", sessionUser.id)
    .single()
  
  const role = (profile?.role as UserRole) ?? "viewer"

  const { data: unitRoles } = await supabase
    .from("user_unit_roles")
    .select(`
      unit_id,
      units(id, name)
    `)
    .eq("user_id", sessionUser.id)

  return {
    id: sessionUser.id,
    name: profile?.full_name ?? "User",
    email: sessionUser.email,
    role,
    units: (unitRoles ?? []).map((r: any) => ({ id: r.unit_id })),
  }
}

export async function getUserRole(): Promise<UserRole> {
  const cu = await getCurrentUser()
  return cu?.role ?? "viewer"
}
