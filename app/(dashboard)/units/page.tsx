import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PermissionGuard } from "@/components/permission-guard"
import { Separator } from "@/components/ui/separator"

const units = [
  { name: "Domboramwari Branch", type: "branch", stake: "Harare Zimbabwe Stake" },
  { name: "Epworth Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { name: "Queensdale Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { name: "Mbare 1 Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { name: "Mbare 2 Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { name: "Highfield Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { name: "Glenview 2nd Ward", type: "ward", stake: "Harare Zimbabwe Stake" },
  { name: "Kambuzuma Branch", type: "branch", stake: "Harare Zimbabwe Stake" },
  { name: "Solomio", type: "branch", stake: "Harare Zimbabwe Stake" },
]

export default function Units() {
  return (
    <PermissionGuard requiredPermissions={["view-all-units", "view-own-unit", "view-assigned-units"]}>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Units</h1>
            <p className="text-sm text-gray-600">Manage and view all units in your area</p>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="max-w-6xl mx-auto w-full">
            <Card>
              <CardHeader>
                <CardTitle>Harare Zimbabwe Stake Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {units.map((unit) => (
                    <Card key={unit.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                            <Building2 className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{unit.name}</h3>
                            <p className="text-sm text-gray-600">{unit.stake}</p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              unit.type === "ward" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                            }
                          >
                            {unit.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </PermissionGuard>
  )
}
