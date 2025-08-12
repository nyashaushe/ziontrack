import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PermissionGuard } from "@/components/permission-guard"
import { Separator } from "@/components/ui/separator"

export default function AdvancedAnalytics() {
  return (
    <PermissionGuard requiredPermissions={["view-advanced-analytics"]}>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-sm text-gray-600">Comprehensive stake-wide analysis and insights</p>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Stake-Wide Performance Dashboard</span>
                  <span className="text-sm font-normal text-purple-600">(Stake Leaders Only)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Cross-Unit Comparison</h3>
                      <p className="text-sm text-gray-600">Compare metrics across all units in the stake</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Trend Analysis</h3>
                      <p className="text-sm text-gray-600">Historical trends and predictive insights</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Resource Allocation</h3>
                      <p className="text-sm text-gray-600">Optimize resource distribution across units</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </PermissionGuard>
  )
}
