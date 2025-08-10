import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PermissionGuard } from "@/components/permission-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCheck, Shield, Eye } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const mockUsers = [
  { name: "President Johnson", role: "stake-leader", unit: "Stake Office", status: "active" },
  { name: "Bishop Smith", role: "unit-leader", unit: "Domboramwari Branch", status: "active" },
  { name: "Elder Williams", role: "viewer", unit: "Domboramwari Branch", status: "active" },
  { name: "Sister Jones", role: "unit-leader", unit: "Epworth Ward", status: "pending" },
]

const roleIcons = {
  "stake-leader": Shield,
  "unit-leader": UserCheck,
  viewer: Eye,
}

export default function UserManagement() {
  return (
    <PermissionGuard requiredPermissions={["manage-users"]}>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600">Manage user roles and permissions</p>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">Add User</Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="max-w-6xl mx-auto w-full">
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user, index) => {
                    const RoleIcon = roleIcons[user.role as keyof typeof roleIcons]
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <RoleIcon className="h-8 w-8 text-gray-600" />
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.unit}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={
                              user.role === "stake-leader"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "unit-leader"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                            }
                          >
                            {user.role.replace("-", " ")}
                          </Badge>
                          <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                            className={user.status === "active" ? "bg-green-100 text-green-700" : ""}
                          >
                            {user.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </PermissionGuard>
  )
}
