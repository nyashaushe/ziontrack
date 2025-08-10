"use client"

import { Settings, Monitor, Smartphone, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { ROLE_CONFIGS, type UserRole } from "@/types/user"

interface SidebarSettingsProps {
  userRole: UserRole
}

export function SidebarSettings({ userRole }: SidebarSettingsProps) {
  const { open, setOpen } = useSidebar()
  const { toast } = useToast()
  const roleConfig = ROLE_CONFIGS[userRole]

  const handleResetToRoleDefault = () => {
    // Clear the cookie to use role default
    document.cookie = "sidebar:state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("sidebar:state")

    // Set to role default
    setOpen(roleConfig.defaultSidebarOpen)

    toast({
      title: "Reset to Role Default",
      description: `Sidebar reset to ${roleConfig.label} default (${roleConfig.defaultSidebarOpen ? "Open" : "Closed"}).`,
    })
  }

  const handleSetAlwaysOpen = () => {
    setOpen(true)
    toast({
      title: "Sidebar Always Open",
      description: "Sidebar will remain open by default.",
    })
  }

  const handleSetAlwaysClosed = () => {
    setOpen(false)
    toast({
      title: "Sidebar Always Closed",
      description: "Sidebar will remain closed by default.",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Sidebar Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>Sidebar Preferences</span>
            <span className="text-xs font-normal text-gray-500">Current role: {roleConfig.label}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSetAlwaysOpen}>
          <Monitor className="mr-2 h-4 w-4" />
          Always Open
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSetAlwaysClosed}>
          <Smartphone className="mr-2 h-4 w-4" />
          Always Closed
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleResetToRoleDefault}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Role Default
          <span className="ml-auto text-xs text-gray-500">({roleConfig.defaultSidebarOpen ? "Open" : "Closed"})</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs text-gray-500">
          <div className="font-medium mb-1">Role Defaults:</div>
          <div>• Stake Leaders: Always open</div>
          <div>• Unit Leaders: Open by default</div>
          <div>• Viewers: Closed by default</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
