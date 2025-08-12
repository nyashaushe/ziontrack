"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BarChart3, Shield, ChevronRight, Star, Target } from "lucide-react"
import { TempleIcon } from "@/components/icons/temple-icon"
import AuthModal from "@/components/auth-modal"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  const handleSignIn = () => {
    setAuthMode("signin")
    setShowAuth(true)
  }

  const handleSignUp = () => {
    setAuthMode("signup")
    setShowAuth(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TempleIcon className="h-8 w-8 text-blue-600" size={32} />
            <span className="text-2xl font-bold text-gray-900">Zion Track</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button onClick={handleSignUp}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Church Leadership Dashboard
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Track and Manage Your{" "}
            <span className="text-blue-600">Church Unit</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your church leadership responsibilities with comprehensive tracking 
            of spiritual and administrative indicators for your ward, branch, or stake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSignUp} className="text-lg px-8">
              Start Tracking
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleSignIn} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Role-Based Access for Church Leadership
            </h2>
            <p className="text-lg text-gray-600">
              Tailored access and permissions based on your church calling
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Viewer Role */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Viewer
                  </Badge>
                </div>
                <CardTitle className="text-green-900">Member Access</CardTitle>
                <CardDescription>
                  Read-only access to assigned units and basic reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-500 mr-2" />
                    View assigned unit data
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-500 mr-2" />
                    Access basic reports
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-500 mr-2" />
                    Monitor key indicators
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Unit Leader Role */}
            <Card className="relative overflow-hidden border-blue-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-800">
                    Unit Leader
                  </Badge>
                </div>
                <CardTitle className="text-blue-900">Ward/Branch Leadership</CardTitle>
                <CardDescription>
                  Full access to your unit with data entry and management capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-blue-500 mr-2" />
                    Manage your unit's data
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-blue-500 mr-2" />
                    Edit and update records
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-blue-500 mr-2" />
                    Generate detailed reports
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-blue-500 mr-2" />
                    Track member progress
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Stake Leader Role */}
            <Card className="relative overflow-hidden border-purple-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Star className="h-8 w-8 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-800">
                    Stake Leader
                  </Badge>
                </div>
                <CardTitle className="text-purple-900">Stake Leadership</CardTitle>
                <CardDescription>
                  Comprehensive access to all units in your stake with advanced management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-purple-500 mr-2" />
                    Access all stake units
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-purple-500 mr-2" />
                    Manage user permissions
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-purple-500 mr-2" />
                    Export comprehensive reports
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-purple-500 mr-2" />
                    Oversee multiple units
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Church Leadership
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to effectively manage your church responsibilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Reporting</h3>
              <p className="text-gray-600">
                Track key spiritual and administrative indicators with detailed analytics and customizable reports.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Member Management</h3>
              <p className="text-gray-600">
                Efficiently manage member information, track progress, and maintain accurate records.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Built with security in mind, ensuring sensitive church data remains protected and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Church Leadership?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join church leaders who are already using Zion Track to manage their responsibilities more effectively.
          </p>
          <Button size="lg" variant="secondary" onClick={handleSignUp} className="text-lg px-8">
            Get Started Today
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TempleIcon className="h-6 w-6" size={24} />
            <span className="text-xl font-bold">Zion Track</span>
          </div>
          <p className="text-gray-400">
            Church Leadership Dashboard - Track and manage key spiritual and administrative indicators
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}