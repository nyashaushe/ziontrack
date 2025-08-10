import type { LucideIcon } from "lucide-react"
import type { Permission } from "@/lib/permissions"

export interface NavigationItem {
  title: string
  icon: LucideIcon
  url: string
  requiredPermissions: Permission[]
  badge?: string
  description?: string
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
  requiredPermissions?: Permission[]
  collapsible?: boolean
}
