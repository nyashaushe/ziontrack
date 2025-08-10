"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type BarItem = { label: string; value: number }
type Props = {
  title: string
  fetchUrl: string
}

export default function ChartJsBar({ title, fetchUrl }: Props) {
  const [items, setItems] = useState<BarItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(fetchUrl)
        const json = await res.json()
        const rows = (json.data as any[] | undefined) ?? []
        const points = rows.map((r) => ({ label: r.unit_name as string, value: Number(r.total ?? 0) }))
        if (!cancelled) setItems(points)
      } catch {
        if (!cancelled)
          setItems([
            { label: "Unit A", value: 12 },
            { label: "Unit B", value: 18 },
            { label: "Unit C", value: 9 },
          ])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [fetchUrl])

  const data = useMemo(
    () => ({
      labels: items.map((i) => i.label),
      datasets: [
        {
          label: "Total",
          data: items.map((i) => i.value),
          backgroundColor: "rgba(147, 51, 234, 0.6)", // purple-600
          borderColor: "rgba(147, 51, 234, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [items],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const },
        title: { display: true, text: title },
        tooltip: { mode: "index" as const, intersect: false },
      },
      scales: {
        x: { ticks: { font: { size: 12 } } },
        y: { ticks: { font: { size: 12 } }, beginAtZero: true },
      },
    }),
    [title],
  )

  return (
    <div className="h-[360px]">
      <Bar data={data} options={options} />
      {loading && <div className="text-xs text-muted-foreground mt-2">Loading...</div>}
    </div>
  )
}
