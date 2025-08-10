export type UserRole = "stake-leader" | "unit-leader" | "viewer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  unit?: string
  stake?: string
  area?: string
}

export interface RoleConfig {
  role: UserRole
  label: string
  description: string
  defaultSidebarOpen: boolean
  permissions: string[]
  color: string
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  "stake-leader": {
    role: "stake-leader",
    label: "Stake Leader",
    description: "Full access to all units in the stake",
    defaultSidebarOpen: true, // Always open for comprehensive overview
    permissions: ["view-all-units", "edit-all-data", "export-reports", "manage-users"],
    color: "purple",
  },
  "unit-leader": {
    role: "unit-leader",
    label: "Unit Leader",
    description: "Access to specific unit data and entry",
    defaultSidebarOpen: true, // Open for easy navigation
    permissions: ["view-own-unit", "edit-own-data", "export-own-reports"],
    color: "blue",
  },
  viewer: {
    role: "viewer",
    label: "Viewer",
    description: "Read-only access to assigned units",
    defaultSidebarOpen: false, // Closed for more content space
    permissions: ["view-assigned-units"],
    color: "green",
  },
}
