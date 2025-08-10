import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const indicatorKey = url.searchParams.get("indicatorKey") ?? "sacrament_attendance"

  const res = await fetch(`${url.origin}/api/rollup/${indicatorKey}`)
  const json = await res.json()

  const rows: { unit_name: string; total: number }[] = json.data ?? []
  const headers = ["Unit", "Total"]
  const csvLines = [headers.join(","), ...rows.map((r) => `"${r.unit_name.replace(/"/g, '""')}",${r.total}`)]
  const csv = csvLines.join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rollup_${indicatorKey}.csv"`,
    },
  })
}
