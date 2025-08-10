import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { UNITS } from "@/lib/constants/units"

export async function GET(_req: Request, { params }: { params: { indicatorKey: string } }) {
  const supabase = getSupabaseServer()
  if (!supabase) {
    // Demo: random totals for each unit
    const demo = UNITS.map((u) => ({
      unit_id: u.id,
      unit_name: u.name,
      total: Math.floor(Math.random() * 200),
    }))
    return NextResponse.json({ data: demo, source: "demo" })
  }

  // Try materialized view first, fallback to live aggregate
  const { data: viewData } = await supabase
    .from("mv_rollup_last_90")
    .select("unit_id,total_value")
    .eq("indicator_key", params.indicatorKey)

  let rows: { unit_id: string; total: number }[] = []
  if (viewData && viewData.length > 0) {
    rows = viewData.map((r: any) => ({ unit_id: r.unit_id, total: Number(r.total_value ?? 0) }))
  } else {
    const { data } = await supabase
      .from("indicator_entries")
      .select("unit_id,value")
      .eq("indicator_key", params.indicatorKey)
      .gte("period_start", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))

    const map = new Map<string, number>()
    for (const r of data ?? []) {
      const key = (r as any).unit_id as string
      const v = Number((r as any).value ?? 0)
      map.set(key, (map.get(key) ?? 0) + v)
    }
    rows = Array.from(map.entries()).map(([unit_id, total]) => ({ unit_id, total }))
  }

  const nameById = new Map(UNITS.map((u) => [u.id, u.name]))
  const data = rows
    .map((r) => ({ unit_id: r.unit_id, unit_name: nameById.get(r.unit_id) ?? r.unit_id, total: r.total }))
    .sort((a, b) => a.unit_name.localeCompare(b.unit_name))

  return NextResponse.json({ data, source: "supabase" })
}
