import type React from "react"
import { getCurrentUser } from "@/lib/user-service"
import { hasAnyPermission, type Permission } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PermissionGuardProps {
  requiredPermissions: Permission[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export async function PermissionGuard({ requiredPermissions, children, fallback }: PermissionGuardProps) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please log in to access this page.</p>
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasAccess = hasAnyPermission(currentUser.role, requiredPermissions)

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page. Your current role ({currentUser.role}) doesn't include the
              required permissions.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
