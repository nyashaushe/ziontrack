import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarSettings } from "@/components/sidebar-settings"
import { UserRoleSwitcher } from "@/components/user-role-switcher"
import { getCurrentUser } from "@/lib/user-service"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/auth/user-menu"

export async function DashboardHeader() {
  const currentUser = await getCurrentUser()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Area Priorities Dashboard</h1>
          <p className="text-sm text-gray-600">Harare Zimbabwe Stake • Q1 2025 • Africa South Area</p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && <UserRoleSwitcher currentRole={currentUser.role} currentUser={currentUser.id} />}
          <SidebarSettings userRole={currentUser?.role || "viewer"} />
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            Add Data
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
