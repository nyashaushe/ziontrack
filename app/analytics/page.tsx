import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { IndicatorLineChart } from "@/components/charts/indicator-line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Analytics() {
  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Trends and comparisons</p>
        </div>
      </header>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IndicatorLineChart
            indicatorKey="sacrament_attendance"
            title="Sacrament Meeting Attendance"
            description="Weekly trend"
          />
          <IndicatorLineChart
            indicatorKey="convert_baptisms"
            title="Convert Baptisms"
            description="Weekly/Monthly trend"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>More Charts Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add more indicators like Ministering Interviews, BYU–Pathway Enrollment, Seminary & Institute, and
                Temple Recommends as data accrues.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
