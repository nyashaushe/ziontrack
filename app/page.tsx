import { DashboardHeader } from "@/components/dashboard-header"
import { UnitSelector } from "@/components/unit-selector"
import { MetricsGrid } from "@/components/metrics-grid"
import { MonthlyProgress } from "@/components/monthly-progress"
import { SidebarInset } from "@/components/ui/sidebar"

export default function Dashboard() {
  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 space-y-6 bg-gray-50">
        <UnitSelector />
        <MetricsGrid />
        <MonthlyProgress />
      </div>
    </SidebarInset>
  )
}
