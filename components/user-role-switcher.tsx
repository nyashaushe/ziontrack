"use client"

import { useTransition } from "react"
import { User, Shield, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ROLE_CONFIGS, type UserRole } from "@/types/user"

interface UserRoleSwitcherProps {
  currentRole: UserRole
  currentUser: string
}

const roleIcons = {
  "stake-leader": Shield,
  "unit-leader": User,
  viewer: Eye,
}

export function UserRoleSwitcher({ currentRole, currentUser }: UserRoleSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const CurrentIcon = roleIcons[currentRole]

  const handleRoleSwitch = (newUserId: string, newRole: UserRole) => {
    startTransition(async () => {
      try {
        // Set new user
        document.cookie = `current-user=${newUserId}; path=/; max-age=${60 * 60 * 24 * 30}`

        // Reset sidebar to role default
        document.cookie = `sidebar:state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`

        toast({
          title: "Role Switched",
          description: `Switched to ${ROLE_CONFIGS[newRole].label}. Sidebar reset to role default.`,
        })

        // Reload to apply new role
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to switch role. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-auto p-2">
          <CurrentIcon className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{ROLE_CONFIGS[currentRole].label}</span>
            <Badge
              variant="secondary"
              className={`text-xs ${
                currentRole === "stake-leader"
                  ? "bg-purple-100 text-purple-700"
                  : currentRole === "unit-leader"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {currentRole}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Switch User Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleRoleSwitch("stake-leader-1", "stake-leader")}
          disabled={isPending || currentRole === "stake-leader"}
        >
          <div className="flex items-center gap-3 w-full">
            <Shield className="h-4 w-4 text-purple-600" />
            <div className="flex-1">
              <div className="font-medium">President Johnson</div>
              <div className="text-xs text-gray-500">Stake Leader - Sidebar: Always Open</div>
            </div>
            {currentRole === "stake-leader" && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Current
              </Badge>
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleRoleSwitch("unit-leader-1", "unit-leader")}
          disabled={isPending || currentRole === "unit-leader"}
        >
          <div className="flex items-center gap-3 w-full">
            <User className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">Bishop Smith</div>
              <div className="text-xs text-gray-500">Unit Leader - Sidebar: Open by Default</div>
            </div>
            {currentRole === "unit-leader" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Current
              </Badge>
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleRoleSwitch("viewer-1", "viewer")}
          disabled={isPending || currentRole === "viewer"}
        >
          <div className="flex items-center gap-3 w-full">
            <Eye className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              <div className="font-medium">Elder Williams</div>
              <div className="text-xs text-gray-500">Viewer - Sidebar: Closed by Default</div>
            </div>
            {currentRole === "viewer" && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Current
              </Badge>
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs text-gray-500">
          <div className="font-medium mb-1">Role-Based Defaults:</div>
          <div>• Stake Leaders: Sidebar always open for overview</div>
          <div>• Unit Leaders: Sidebar open for easy navigation</div>
          <div>• Viewers: Sidebar closed for more content space</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
