"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface TestResult {
  operation: string
  success: boolean
  message: string
  data?: any
}

export function CrudTest() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const supabase = getSupabaseClient()

  const runTests = async () => {
    if (!supabase) {
      setResults([{ operation: "Connection", success: false, message: "Supabase client not available" }])
      return
    }

    setTesting(true)
    const testResults: TestResult[] = []

    try {
      // Test 1: READ - Fetch units
      console.log("Testing READ operation...")
      const { data: units, error: readError } = await supabase
        .from("units")
        .select("*")
        .limit(1)

      if (readError) {
        testResults.push({ operation: "READ (Units)", success: false, message: readError.message })
      } else if (units && units.length > 0) {
        testResults.push({ operation: "READ (Units)", success: true, message: `Found ${units.length} unit(s)`, data: units[0] })
        
        const testUnitId = units[0].id

        // Test 2: CREATE - Insert test entry
        console.log("Testing CREATE operation...")
        const { data: insertData, error: insertError } = await supabase
          .from("indicator_entries")
          .insert({
            unit_id: testUnitId,
            indicator_key: "test_indicator",
            period_start: "2024-01-01",
            value: 42,
            notes: "Test entry for CRUD verification"
          })
          .select()
          .single()

        if (insertError) {
          testResults.push({ operation: "CREATE (Insert)", success: false, message: insertError.message })
        } else {
          testResults.push({ operation: "CREATE (Insert)", success: true, message: "Entry created successfully", data: insertData })
          
          const testEntryId = insertData.id

          // Test 3: UPDATE - Modify the test entry
          console.log("Testing UPDATE operation...")
          const { error: updateError } = await supabase
            .from("indicator_entries")
            .update({ value: 84, notes: "Updated test entry" })
            .eq("id", testEntryId)

          if (updateError) {
            testResults.push({ operation: "UPDATE", success: false, message: updateError.message })
          } else {
            testResults.push({ operation: "UPDATE", success: true, message: "Entry updated successfully" })
          }

          // Test 4: DELETE - Remove the test entry
          console.log("Testing DELETE operation...")
          const { error: deleteError } = await supabase
            .from("indicator_entries")
            .delete()
            .eq("id", testEntryId)

          if (deleteError) {
            testResults.push({ operation: "DELETE", success: false, message: deleteError.message })
          } else {
            testResults.push({ operation: "DELETE", success: true, message: "Entry deleted successfully" })
          }
        }
      } else {
        testResults.push({ operation: "READ (Units)", success: false, message: "No units found in database" })
      }

    } catch (error) {
      testResults.push({ 
        operation: "General", 
        success: false, 
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      })
    }

    setResults(testResults)
    setTesting(false)
  }

  const getIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CRUD Operations Test</CardTitle>
        <p className="text-sm text-gray-600">
          Test all database operations to verify functionality
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={testing || !supabase}
            className="w-full"
          >
            {testing ? "Running Tests..." : "Run CRUD Tests"}
          </Button>

          {!supabase && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">Database not configured</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Test Results:</h4>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded border ${
                    result.success 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {getIcon(result.success)}
                  <div className="flex-1">
                    <div className="font-medium">
                      {result.operation}
                    </div>
                    <div className={`text-sm ${
                      result.success ? "text-green-700" : "text-red-700"
                    }`}>
                      {result.message}
                    </div>
                    {result.data && (
                      <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>What this tests:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>READ:</strong> Fetch units from database</li>
              <li><strong>CREATE:</strong> Insert a test indicator entry</li>
              <li><strong>UPDATE:</strong> Modify the test entry</li>
              <li><strong>DELETE:</strong> Remove the test entry</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}