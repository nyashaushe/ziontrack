"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function createIndicatorEntry(formData: FormData) {
  const supabase = getSupabaseServer()
  const unitId = formData.get("unitId") as string
  const indicatorKey = formData.get("indicatorKey") as string
  const periodStart = formData.get("periodStart") as string
  const value = Number((formData.get("value") as string) || 0)
  const notes = (formData.get("notes") as string) || null

  if (!unitId || !indicatorKey || !periodStart) {
    return { ok: false, message: "Missing required fields" }
  }

  if (!supabase) {
    return { ok: false, message: "Supabase is not configured. Add env vars and try again." }
  }

  const { error } = await supabase.from("indicator_entries").insert({
    unit_id: unitId,
    indicator_key: indicatorKey,
    period_start: periodStart,
    value,
    notes,
  })

  if (error) {
    return { ok: false, message: error.message }
  }

  revalidatePath("/")
  revalidatePath("/analytics")
  return { ok: true, message: "Entry saved" }
}
