import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(_req: Request, { params }: { params: { indicatorKey: string } }) {
  try {
    const supabase = await getSupabaseServer()
    
    if (!supabase) {
      return NextResponse.json({ 
        data: [], 
        source: "demo",
        error: "Database not configured" 
      })
    }

    // Get units and their rollup data in one query
    const { data, error } = await supabase
      .from("indicator_entries")
      .select(`
        unit_id,
        value,
        units!inner(id, name, type)
      `)
      .eq("indicator_key", params.indicatorKey)
      .gte("period_start", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))

    if (error) {
      console.error("Rollup query error:", error)
      return NextResponse.json({ 
        data: [], 
        source: "supabase",
        error: error.message 
      })
    }

    // Aggregate the data by unit
    const unitTotals = new Map<string, { name: string; total: number }>()
    
    for (const entry of data || []) {
      const unitId = entry.unit_id
      const unitName = (entry.units as any)?.name || 'Unknown Unit'
      const value = Number(entry.value || 0)
      
      if (unitTotals.has(unitId)) {
        unitTotals.get(unitId)!.total += value
      } else {
        unitTotals.set(unitId, { name: unitName, total: value })
      }
    }

    // Convert to array format
    const result = Array.from(unitTotals.entries()).map(([unit_id, { name, total }]) => ({
      unit_id,
      unit_name: name,
      total
    })).sort((a, b) => a.unit_name.localeCompare(b.unit_name))

    return NextResponse.json({ data: result, source: "supabase" })
  } catch (err) {
    console.error("Rollup API error:", err)
    return NextResponse.json({ 
      data: [], 
      source: "error",
      error: err instanceof Error ? err.message : "Unknown error" 
    })
  }
}
