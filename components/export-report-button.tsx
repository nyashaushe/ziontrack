"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = { indicatorKey: string }

export function ExportReportButton({ indicatorKey }: Props) {
  const onClick = () => {
    const url = `/api/export/rollup?indicatorKey=${encodeURIComponent(indicatorKey)}`
    window.open(url, "_blank")
  }
  return (
    <Button variant="outline" className="gap-2 bg-transparent" onClick={onClick}>
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  )
}
