"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  BarChart3, 
  Shield, 
  Star, 
  Target,
  Settings,
  LogOut,
  Eye,
  Edit,
  Crown,
  MapPin,
  Calendar,
  TrendingUp,
  UserCheck,
  BookOpen,
  Heart
} from "lucide-react"
import { TempleIcon } from "@/components/icons/temple-icon"
import { signOut } from "@/lib/auth-actions"
import { ROLE_CONFIGS, type UserRole } from "@/types/user"
import type { CurrentUser } from "@/lib/user-service"
import AdminPanel from "@/components/admin-panel"

interface DashboardProps {
  user: CurrentUser
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const roleConfig = ROLE_CONFIGS[user.role]

  const handleSignOut = async () => {
    await signOut()
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "stake-leader":
        return <Crown className="h-5 w-5" />
      case "unit-leader":
        return <Shield className="h-5 w-5" />
      case "viewer":
        return <Eye className="h-5 w-5" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  const getAccessibleUnits = () => {
    if (user.role === "stake-leader") {
      return [
        { id: "1", name: "First Ward", members: 245, active: 180 },
        { id: "2", name: "Second Ward", members: 198, active: 145 },
        { id: "3", name: "Third Ward", members: 267, active: 201 },
        { id: "4", name: "YSA Branch", members: 89, active: 67 }
      ]
    } else if (user.role === "unit-leader") {
      return [
        { id: user.units[0]?.id || "1", name: "First Ward", members: 245, active: 180 }
      ]
    } else {
      return user.units.length > 0 
        ? [{ id: user.units[0].id, name: "First Ward", members: 245, active: 180 }]
        : []
    }
  }

  const accessibleUnits = getAccessibleUnits()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <TempleIcon className="h-8 w-8 text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Zion Track</h1>
                <p className="text-sm text-gray-500">Church Leadership Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <div className="flex items-center space-x-2">
                  {getRoleIcon(user.role)}
                  <Badge 
                    variant="secondary" 
                    className={`bg-${roleConfig.color}-100 text-${roleConfig.color}-800`}
                  >
                    {roleConfig.label}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-gray-600">
            {roleConfig.description} - {user.role === "stake-leader" ? `Managing ${accessibleUnits.length} units` : `Access to ${accessibleUnits.length} unit${accessibleUnits.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Role-based Access Alert */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Your Access Level:</strong> {roleConfig.description}
            <br />
            <strong>Permissions:</strong> {roleConfig.permissions.join(", ")}
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <TempleIcon className="h-4 w-4 text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessibleUnits.length}</div>
              <p className="text-xs text-muted-foreground">
                {user.role === "stake-leader" ? "Stake-wide access" : "Your assigned units"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accessibleUnits.reduce((sum, unit) => sum + unit.members, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accessible units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accessibleUnits.reduce((sum, unit) => sum + unit.active, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((accessibleUnits.reduce((sum, unit) => sum + unit.active, 0) / accessibleUnits.reduce((sum, unit) => sum + unit.members, 0)) * 100)}% activity rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">
                Activity increase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="admin" disabled={user.role !== "stake-leader"}>
              Admin
            </TabsTrigger>
            <TabsTrigger value="settings" disabled={user.role === "viewer"}>
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sacrament Meeting Attendance Updated</p>
                        <p className="text-xs text-gray-500">First Ward - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Member Record Added</p>
                        <p className="text-xs text-gray-500">Second Ward - 5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Monthly Report Generated</p>
                        <p className="text-xs text-gray-500">Stake Level - 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Key Spiritual Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sacrament Attendance</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temple Attendance</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Home Teaching</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Missionary Work</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessibleUnits.map((unit) => (
                <Card key={unit.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {unit.name}
                      </span>
                      {user.role !== "viewer" && (
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Members:</span>
                        <span className="text-sm font-medium">{unit.members}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Members:</span>
                        <span className="text-sm font-medium">{unit.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Activity Rate:</span>
                        <span className="text-sm font-medium">
                          {Math.round((unit.active / unit.members) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>
                    Generate reports based on your access level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roleConfig.permissions.includes("view-assigned-units") && (
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Unit Activity Report
                    </Button>
                  )}
                  {roleConfig.permissions.includes("export-own-reports") && (
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Monthly Statistics
                    </Button>
                  )}
                  {roleConfig.permissions.includes("export-reports") && (
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Stake-wide Analysis
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {accessibleUnits.length}
                      </div>
                      <p className="text-sm text-gray-600">Units Under Your Stewardship</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {Math.round((accessibleUnits.reduce((sum, unit) => sum + unit.active, 0) / accessibleUnits.reduce((sum, unit) => sum + unit.members, 0)) * 100)}%
                      </div>
                      <p className="text-sm text-gray-600">Overall Activity Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <AdminPanel currentUser={user} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm text-gray-600">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <p className="text-sm text-gray-600">{roleConfig.label}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Units Access</label>
                    <p className="text-sm text-gray-600">
                      {accessibleUnits.map(unit => unit.name).join(", ") || "No units assigned"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
