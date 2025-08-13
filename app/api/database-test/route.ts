import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServer()
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: "Supabase not configured - missing environment variables"
      })
    }

    // Test if the units table exists with correct structure
    const { data, error } = await supabase
      .from("units")
      .select("id, unit_code, name, type")
      .limit(1)

    if (error) {
      // Check if it's a UUID error (old structure still exists)
      if (error.message.includes('invalid input syntax for type uuid')) {
        return NextResponse.json({
          success: false,
          error: "Database has old structure. Please run the supabase-clean-setup.sql script to reset your database with correct UUID structure."
        })
      }
      
      return NextResponse.json({
        success: false,
        error: `Database error: ${error.message}`
      })
    }

    // Check if we have the expected structure
    if (data && data.length > 0) {
      const unit = data[0]
      if (typeof unit.id === 'string' && unit.id.includes('-') && unit.id.length === 36) {
        // Looks like a UUID
        return NextResponse.json({
          success: true,
          message: "Database connection successful with correct UUID structure",
          sampleUnit: unit
        })
      } else {
        return NextResponse.json({
          success: false,
          error: "Database structure is incorrect. Unit IDs should be UUIDs. Please run supabase-clean-setup.sql"
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: "No units found in database. Please run supabase-clean-setup.sql to create sample data."
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    })
  }
}