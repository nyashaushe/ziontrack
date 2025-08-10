import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { generateDemoSeries } from "@/lib/demo"

export async function GET(_req: Request, { params }: { params: { unitId: string; indicatorKey: string } }) {
  const supabase = getSupabaseServer()

  // If no Supabase envs, return demo series gracefully
  if (!supabase) {
    return NextResponse.json({ data: generateDemoSeries(12), source: "demo" })
  }

  // Example: fetch last 12 records for unit/indicator, ordered by date
  // Schema suggestion:
  // indicator_entries(id, unit_id, indicator_key, period_start, value, notes, created_at)
  const { data, error } = await supabase
    .from("indicator_entries")
    .select("period_start,value")
    .eq("unit_id", params.unitId)
    .eq("indicator_key", params.indicatorKey)
    .order("period_start", { ascending: true })
    .limit(24)

  if (error) {
    // On RLS/permission errors, return demo to keep UI functional during setup
    return NextResponse.json({ data: generateDemoSeries(12), source: "demo" })
  }

  const out = (data || []).map((d) => ({
    date: (d as any).period_start?.slice(0, 10) ?? "",
    value: Number((d as any).value ?? 0),
  }))

  return NextResponse.json({ data: out, source: "supabase" })
}
