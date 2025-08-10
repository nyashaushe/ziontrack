import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChartJsBar from "@/components/charts/chartjs-bar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StakeRollupPage() {
  const indicator = "sacrament_attendance"

  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Stake Rollup</h1>
            <p className="text-sm text-gray-600">Compare units across indicators and export summaries</p>
          </div>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href={`/api/export/rollup?indicatorKey=${indicator}`} prefetch={false}>
              Download CSV
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sacrament Meeting Attendance - Last 90 Days (Totals)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartJsBar title="Attendance by Unit" fetchUrl={`/api/rollup/${indicator}`} />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
