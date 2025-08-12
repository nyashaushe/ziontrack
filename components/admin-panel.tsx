"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  Shield, 
  Crown, 
  Eye, 
  Settings,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react"
import { ROLE_CONFIGS, type UserRole } from "@/types/user"
import type { CurrentUser } from "@/lib/user-service"

interface AdminPanelProps {
  currentUser: CurrentUser
}

export default function AdminPanel({ currentUser }: AdminPanelProps) {
  const [users] = useState([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "unit-leader" as UserRole,
      units: ["First Ward"],
      lastActive: "2 hours ago"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "viewer" as UserRole,
      units: ["Second Ward"],
      lastActive: "1 day ago"
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@example.com", 
      role: "stake-leader" as UserRole,
      units: ["All Units"],
      lastActive: "30 minutes ago"
    }
  ])

  // Only stake leaders can access admin panel
  if (currentUser.role !== "stake-leader") {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Access denied. Only stake leaders can access the admin panel.
        </AlertDescription>
      </Alert>
    )
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "stake-leader":
        return <Crown className="h-4 w-4" />
      case "unit-leader":
        return <Shield className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    const config = ROLE_CONFIGS[role]
    switch (config.color) {
      case "purple":
        return "bg-purple-100 text-purple-800"
      case "blue":
        return "bg-blue-100 text-blue-800"
      case "green":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user roles and permissions across your stake</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stake Leaders</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "stake-leader").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unit Leaders</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "unit-leader").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewers</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "viewer").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user roles and unit assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Last active: {user.lastActive}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {ROLE_CONFIGS[user.role].label}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.units.join(", ")}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Reference</CardTitle>
          <CardDescription>
            Understanding what each role can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
              <div key={key} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getRoleIcon(key as UserRole)}
                  <h4 className="font-medium">{config.label}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                <div className="space-y-1">
                  {config.permissions.map((permission) => (
                    <div key={permission} className="text-xs text-gray-500">
                      • {permission.replace(/-/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}