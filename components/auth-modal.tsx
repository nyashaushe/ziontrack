"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User } from "lucide-react"
import { TempleIcon } from "@/components/icons/temple-icon"
import { signIn, signUp } from "@/lib/auth-actions"
import { ROLE_CONFIGS } from "@/types/user"
import DemoLogin from "@/components/demo-login"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "signin" | "signup"
  onModeChange: (mode: "signin" | "signup") => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDemo, setShowDemo] = useState(false)

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"viewer" | "unit-leader" | "stake-leader">("viewer")
  const [selectedUnit, setSelectedUnit] = useState("")
  
  // Harare Zimbabwe South Stake units
  const availableUnits = [
    "Harare 1st Ward",
    "Harare 2nd Ward", 
    "Harare 3rd Ward",
    "Chitungwiza Ward",
    "Norton Ward",
    "Ruwa Ward",
    "Young Single Adult Branch"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (mode === "signin") {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess("Signed in successfully! Redirecting...")
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1000)
        }
      } else {
        const result = await signUp(email, password, {
          full_name: fullName,
          role,
          unit: selectedUnit
        })
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess("Account created! Please check your email to verify your account.")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setRole("viewer")
    setSelectedUnit("")
    setError("")
    setSuccess("")
  }

  const handleModeChange = (newMode: "signin" | "signup") => {
    resetForm()
    onModeChange(newMode)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <TempleIcon className="h-8 w-8 text-blue-600 mr-2" size={32} />
            <DialogTitle className="text-2xl">Zion Track</DialogTitle>
          </div>
          <DialogDescription className="text-center">
            {mode === "signin" 
              ? "Sign in to your church leadership dashboard" 
              : "Create your church leadership account"
            }
          </DialogDescription>
        </DialogHeader>

        {showDemo ? (
          <DemoLogin onClose={() => setShowDemo(false)} />
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(true)}
                className="text-sm"
              >
                Try Demo Accounts
              </Button>
            </div>

            <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your church leadership dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription className="text-green-600">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Account</CardTitle>
                <CardDescription>
                  Set up your church leadership account with role-based access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Church Calling/Role</Label>
                    <Select value={role} onValueChange={(value: any) => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                config.color === 'purple' ? 'bg-purple-500' :
                                config.color === 'blue' ? 'bg-blue-500' :
                                config.color === 'green' ? 'bg-green-500' : 'bg-gray-500'
                              }`}></div>
                              <div>
                                <div className="font-medium">{config.label}</div>
                                <div className="text-sm text-gray-500">{config.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit Selection - Only show for Unit Leaders and Viewers */}
                  {role !== "stake-leader" && (
                    <div className="space-y-2">
                      <Label htmlFor="unit">Select Your Unit</Label>
                      <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your ward or branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUnits.map((unitName) => (
                            <SelectItem key={unitName} value={unitName}>
                              {unitName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Harare Zimbabwe South Stake
                      </p>
                    </div>
                  )}

                  {/* Stake Leader Info */}
                  {role === "stake-leader" && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800 font-medium">
                        Stake Leadership Access
                      </p>
                      <p className="text-xs text-purple-600">
                        You will have access to all units in Harare Zimbabwe South Stake
                      </p>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription className="text-green-600">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </>
        )}
      </DialogContent>
    </Dialog>
  )
}
