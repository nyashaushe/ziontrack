import type { UserRole } from "@/types/user"
import { ROLE_CONFIGS } from "@/types/user"

export type Permission =
  | "view-dashboard"
  | "view-all-units"
  | "view-own-unit"
  | "view-assigned-units"
  | "edit-all-data"
  | "edit-own-data"
  | "view-analytics"
  | "view-advanced-analytics"
  | "export-reports"
  | "export-own-reports"
  | "manage-users"
  | "manage-goals"
  | "view-area-priorities"
  | "manage-area-priorities"

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const roleConfig = ROLE_CONFIGS[userRole]

  // Define permission mappings for each role
  const rolePermissions: Record<UserRole, Permission[]> = {
    "stake-leader": [
      "view-dashboard",
      "view-all-units",
      "edit-all-data",
      "view-analytics",
      "view-advanced-analytics",
      "export-reports",
      "manage-users",
      "manage-goals",
      "view-area-priorities",
      "manage-area-priorities",
    ],
    "unit-leader": [
      "view-dashboard",
      "view-own-unit",
      "edit-own-data",
      "view-analytics",
      "export-own-reports",
      "view-area-priorities",
    ],
    viewer: ["view-dashboard", "view-assigned-units", "view-area-priorities"],
  }

  return rolePermissions[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}
