"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, Crown, Check } from "lucide-react"
import { ROLE_CONFIGS, type UserRole } from "@/types/user"

interface RoleSelectorProps {
  selectedRole: UserRole
  onRoleSelect: (role: UserRole) => void
}

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "stake-leader":
        return <Crown className="h-8 w-8" />
      case "unit-leader":
        return <Shield className="h-8 w-8" />
      case "viewer":
        return <Users className="h-8 w-8" />
      default:
        return <Users className="h-8 w-8" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "stake-leader":
        return "purple"
      case "unit-leader":
        return "blue"
      case "viewer":
        return "green"
      default:
        return "gray"
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Your Church Calling</h3>
        <p className="text-sm text-gray-600">
          Choose the role that best matches your current church responsibilities
        </p>
      </div>

      <div className="grid gap-4">
        {Object.entries(ROLE_CONFIGS).map(([key, config]) => {
          const role = key as UserRole
          const isSelected = selectedRole === role
          const color = getRoleColor(role)
          
          return (
            <Card 
              key={role} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? `ring-2 ring-${color}-500 bg-${color}-50` 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onRoleSelect(role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`text-${color}-600`}>
                      {getRoleIcon(role)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.label}</CardTitle>
                      <CardDescription className="text-sm">
                        {config.description}
                      </CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <div className={`bg-${color}-500 text-white rounded-full p-1`}>
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {config.permissions.slice(0, 2).map((permission) => (
                      <Badge 
                        key={permission} 
                        variant="secondary" 
                        className={`text-xs bg-${color}-100 text-${color}-800`}
                      >
                        {permission.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                    {config.permissions.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{config.permissions.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <strong>Default sidebar:</strong> {config.defaultSidebarOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Role Descriptions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Viewer:</strong> Members with read-only access to assigned units</li>
          <li><strong>Unit Leader:</strong> Bishopric, Branch Presidency, or other unit leadership</li>
          <li><strong>Stake Leader:</strong> Stake Presidency, High Council, or stake-level callings</li>
        </ul>
      </div>
    </div>
  )
}