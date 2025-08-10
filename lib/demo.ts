export type IndicatorKey =
  | "sacrament_attendance"
  | "ministering_interviews"
  | "byu_pathway_enrollment"
  | "convert_baptisms"
  | "seminary_institute"
  | "temple_recommends"
  | "lessons_with_member"

export function generateDemoSeries(days = 10) {
  const out: { date: string; value: number }[] = []
  const start = new Date()
  start.setDate(start.getDate() - days + 1)
  let base = Math.floor(Math.random() * 50) + 20
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    base += Math.floor(Math.random() * 7) - 3
    if (base < 0) base = Math.floor(Math.random() * 10)
    out.push({ date: d.toISOString().slice(0, 10), value: base })
  }
  return out
}
