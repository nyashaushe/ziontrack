"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface DatabaseStatus {
  configured: boolean
  connected: boolean
  error?: string
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus>({ configured: false, connected: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      // Check if environment variables are configured
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!hasUrl || !hasKey) {
        setStatus({
          configured: false,
          connected: false,
          error: "Environment variables not configured"
        })
        setLoading(false)
        return
      }

      // Try to make a simple database call
      const response = await fetch('/api/database-test')
      const result = await response.json()
      
      setStatus({
        configured: true,
        connected: result.success,
        error: result.error
      })
    } catch (err) {
      setStatus({
        configured: true,
        connected: false,
        error: "Failed to test database connection"
      })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Checking database connection...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {status.configured ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <span className={status.configured ? "text-green-700" : "text-red-700"}>
            Environment Variables: {status.configured ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status.connected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <span className={status.connected ? "text-green-700" : "text-red-700"}>
            Database Connection: {status.connected ? "Connected" : "Failed"}
          </span>
        </div>

        {status.error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-700">Error:</p>
              <p className="text-sm text-red-600">{status.error}</p>
            </div>
          </div>
        )}

        {!status.configured && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="font-medium text-blue-700">Setup Required:</p>
            <p className="text-sm text-blue-600 mt-1">
              Create a <code>.env.local</code> file with your Supabase credentials:
            </p>
            <pre className="text-xs bg-blue-100 p-2 rounded mt-2 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key`}
            </pre>
          </div>
        )}

        {status.configured && !status.connected && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-medium text-yellow-700">Database Setup Required:</p>
            <p className="text-sm text-yellow-600 mt-1">
              Run the SQL setup script in your Supabase dashboard to create the required tables.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}