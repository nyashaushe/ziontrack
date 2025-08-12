import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IndicatorEntryForm } from "@/components/forms/indicator-entry-form"
import { IndicatorManagement } from "@/components/indicator-management"
import { getCurrentUser } from "@/lib/user-service"

export default async function DataEntry() {
  const currentUser = await getCurrentUser()
  const unitId = currentUser?.units[0]?.id || "harare1-ward"

  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Data Entry</h1>
          <p className="text-sm text-gray-600">Submit weekly or monthly indicator data</p>
        </div>
      </header>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Indicator Entry (INSERT Operation)</CardTitle>
            </CardHeader>
            <CardContent>
              <IndicatorEntryForm />
            </CardContent>
          </Card>

          <IndicatorManagement unitId={unitId} />
        </div>
      </div>
    </SidebarInset>
  )
}
