"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Shield, Eye, Users } from "lucide-react"
import { DEMO_CREDENTIALS } from "@/lib/demo-users"
import { signIn } from "@/lib/auth-actions"
import { useState } from "react"

interface DemoLoginProps {
  onClose: () => void
}

export default function DemoLogin({ onClose }: DemoLoginProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleDemoLogin = async (email: string, password: string) => {
    setLoading(email)
    try {
      const result = await signIn(email, password)
      if (result.success) {
        // Close modal first
        onClose()
        // Small delay to ensure cookie is set, then redirect
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 100)
      }
    } catch (error) {
      console.error("Demo login error:", error)
    } finally {
      setLoading(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Stake Leader":
        return <Crown className="h-5 w-5 text-purple-600" />
      case "Unit Leader":
        return <Shield className="h-5 w-5 text-blue-600" />
      case "Viewer":
        return <Eye className="h-5 w-5 text-green-600" />
      default:
        return <Users className="h-5 w-5 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Stake Leader":
        return "bg-purple-100 text-purple-800"
      case "Unit Leader":
        return "bg-blue-100 text-blue-800"
      case "Viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Demo Accounts Available</h3>
        <p className="text-sm text-gray-600">
          Click any account below to sign in and test different access levels
        </p>
      </div>

      <div className="space-y-3">
        {DEMO_CREDENTIALS.map((cred) => (
          <Card 
            key={cred.email} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDemoLogin(cred.email, cred.password)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getRoleIcon(cred.role)}
                  <div>
                    <CardTitle className="text-base">{cred.email}</CardTitle>
                    <CardDescription className="text-sm">
                      {cred.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getRoleColor(cred.role)}>
                  {cred.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full" 
                size="sm"
                disabled={loading === cred.email}
              >
                {loading === cred.email ? "Signing in..." : `Sign in as ${cred.role}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Harare Zimbabwe South Stake</h4>
        <p className="text-sm text-blue-800">
          These demo accounts represent different leadership roles in the stake.
          Each account shows different features and access levels.
        </p>
      </div>

      <Button variant="outline" onClick={onClose} className="w-full">
        Back to Regular Login
      </Button>
    </div>
  )
}