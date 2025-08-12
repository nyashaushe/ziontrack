"use server"

import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Create a Supabase client for server actions
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[Auth Actions] Supabase not configured - authentication unavailable")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    return { error: "Authentication service is not available. Please try again later." }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log("[Auth Actions] Sign in error:", error.message)
      return { error: error.message }
    }

    if (data.user) {
      console.log("[Auth Actions] User signed in successfully:", data.user.email)
      revalidatePath("/", "layout")
      return { success: true, user: data.user }
    }

    return { error: "Sign in failed. Please try again." }
  } catch (error) {
    console.error("[Auth Actions] Sign in exception:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(
  email: string, 
  password: string, 
  metadata: {
    full_name: string
    role: string
    unit?: string
  }
) {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    return { error: "Authentication service is not available. Please try again later." }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          role: metadata.role,
          unit: metadata.unit || "",
        },
      },
    })

    if (error) {
      console.log("[Auth Actions] Sign up error:", error.message)
      return { error: error.message }
    }

    if (data.user) {
      console.log("[Auth Actions] User signed up successfully:", data.user.email)
      
      // If email confirmation is disabled, the user will be automatically signed in
      if (data.session) {
        revalidatePath("/", "layout")
      }
      
      return { 
        success: true, 
        user: data.user,
        needsConfirmation: !data.session 
      }
    }

    return { error: "Sign up failed. Please try again." }
  } catch (error) {
    console.error("[Auth Actions] Sign up exception:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = getSupabaseClient()
  
  if (!supabase) {
    // If Supabase is not available, just redirect to home
    redirect("/")
  }

  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.log("[Auth Actions] Sign out error:", error.message)
    } else {
      console.log("[Auth Actions] User signed out successfully")
    }
  } catch (error) {
    console.error("[Auth Actions] Sign out exception:", error)
  }

  revalidatePath("/", "layout")
  redirect("/")
}