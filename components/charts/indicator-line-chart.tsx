"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useUnit } from "../unit-context"
import { generateDemoSeries } from "@/lib/demo"

type Props = {
  indicatorKey: string
  title: string
  description?: string
  colorVar?: string
}

export function IndicatorLineChart({ indicatorKey, title, description, colorVar = "var(--color-primary)" }: Props) {
  const { selectedUnit } = useUnit()
  const [data, setData] = useState<{ date: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/indicators/${selectedUnit.id}/${indicatorKey}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        if (!cancelled) setData(json.data)
      } catch {
        if (!cancelled) setData(generateDemoSeries(12))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [selectedUnit.id, indicatorKey])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            value: { label: "Value", color: "hsl(var(--chart-1))" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        {loading && <div className="text-xs text-muted-foreground mt-2">Loading...</div>}
      </CardContent>
    </Card>
  )
}
