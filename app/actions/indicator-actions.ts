"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function createIndicatorEntry(formData: FormData) {
  const unitId = formData.get("unitId") as string
  const indicatorKey = formData.get("indicatorKey") as string
  const periodStart = formData.get("periodStart") as string
  const valueStr = formData.get("value") as string
  const notes = (formData.get("notes") as string) || null

  // Validation
  if (!unitId || !indicatorKey || !periodStart || !valueStr) {
    return { ok: false, message: "All required fields must be filled out" }
  }

  const value = Number(valueStr)
  if (isNaN(value) || value < 0) {
    return { ok: false, message: "Value must be a valid positive number" }
  }

  if (value > 10000) {
    return { ok: false, message: "Value cannot exceed 10,000" }
  }

  // Validate date is not in the future
  const entryDate = new Date(periodStart)
  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today
  
  if (entryDate > today) {
    return { ok: false, message: "Date cannot be in the future" }
  }

  // Validate notes length
  if (notes && notes.length > 500) {
    return { ok: false, message: "Notes cannot exceed 500 characters" }
  }

  try {
    const supabase = await getSupabaseServer()
    
    if (!supabase) {
      return { ok: false, message: "Database not configured. Please add your Supabase environment variables." }
    }

    // Check for duplicate entries (same unit, indicator, and date)
    const { data: existing, error: checkError } = await supabase
      .from("indicator_entries")
      .select("id")
      .eq("unit_id", unitId)
      .eq("indicator_key", indicatorKey)
      .eq("period_start", periodStart)
      .limit(1)

    if (checkError) {
      console.error("Error checking for duplicates:", checkError)
      return { ok: false, message: "Error validating entry" }
    }

    if (existing && existing.length > 0) {
      return { ok: false, message: "An entry for this indicator and date already exists. Please update the existing entry instead." }
    }

    const { error } = await supabase.from("indicator_entries").insert({
      unit_id: unitId,
      indicator_key: indicatorKey,
      period_start: periodStart,
      value,
      notes,
    })

    if (error) {
      console.error("Database error:", error)
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        return { ok: false, message: "An entry for this indicator and date already exists" }
      } else if (error.code === '23503') { // Foreign key violation
        return { ok: false, message: "Invalid unit selected. Please refresh and try again." }
      } else {
        return { ok: false, message: `Database error: ${error.message}` }
      }
    }

    revalidatePath("/data-entry")
    revalidatePath("/analytics")
    return { ok: true, message: "Entry saved successfully!" }
  } catch (err) {
    console.error("Unexpected error:", err)
    return { ok: false, message: "An unexpected error occurred. Please try again." }
  }
}
