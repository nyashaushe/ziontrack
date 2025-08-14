"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit2, Save, X } from "lucide-react"
import { toast } from "sonner"

interface IndicatorEntry {
  id: string
  indicator_key: string
  period_start: string
  value: number
  notes: string | null
  unit_id: string
}

interface Unit {
  id: string
  unit_code: string
  name: string
  type: string
}

export function IndicatorManagement() {
  const [entries, setEntries] = useState<IndicatorEntry[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [selectedUnitId, setSelectedUnitId] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [editNotes, setEditNotes] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()

  // Fetch available units
  const fetchUnits = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from("units")
        .select("id, unit_code, name, type")
        .order("name")

      if (error) {
        console.error("Error fetching units:", error)
      } else {
        setUnits(data || [])
        // Set first unit as selected if none selected
        if (data && data.length > 0 && !selectedUnitId) {
          setSelectedUnitId(data[0].id)
        }
      }
    } catch (err) {
      console.error("Fetch units exception:", err)
    }
  }

  // Fetch entries for selected unit
  const fetchEntries = async () => {
    if (!supabase || !selectedUnitId) {
      setError("Database not configured or no unit selected")
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from("indicator_entries")
        .select("*")
        .eq("unit_id", selectedUnitId)
        .order("period_start", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching entries:", error)
        setError(`Database error: ${error.message}`)
        setEntries([])
      } else {
        setEntries(data || [])
        setError(null)
      }
    } catch (err) {
      console.error("Fetch entries exception:", err)
      setError("Failed to connect to database")
      setEntries([])
    }
    
    setLoading(false)
  }

  // UPDATE operation
  const updateEntry = async (id: string, value: number, notes: string) => {
    if (!supabase) {
      toast.error("Database not configured")
      return
    }

    try {
      const { error } = await supabase
        .from("indicator_entries")
        .update({ value, notes })
        .eq("id", id)

      if (error) {
        toast.error(`Failed to update entry: ${error.message}`)
        console.error("Update error:", error)
      } else {
        toast.success("Entry updated successfully")
        setEditingId(null)
        fetchEntries() // Refresh the list
      }
    } catch (err) {
      toast.error("Update failed - connection error")
      console.error("Update exception:", err)
    }
  }

  // DELETE operation
  const deleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    if (!supabase) {
      toast.error("Database not configured")
      return
    }

    try {
      const { error } = await supabase
        .from("indicator_entries")
        .delete()
        .eq("id", id)

      if (error) {
        toast.error(`Failed to delete entry: ${error.message}`)
        console.error("Delete error:", error)
      } else {
        toast.success("Entry deleted successfully")
        fetchEntries() // Refresh the list
      }
    } catch (err) {
      toast.error("Delete failed - connection error")
      console.error("Delete exception:", err)
    }
  }

  const startEdit = (entry: IndicatorEntry) => {
    setEditingId(entry.id)
    setEditValue(entry.value)
    setEditNotes(entry.notes || "")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue(0)
    setEditNotes("")
  }

  const saveEdit = () => {
    if (editingId) {
      updateEntry(editingId, editValue, editNotes)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  useEffect(() => {
    if (selectedUnitId) {
      fetchEntries()
    }
  }, [selectedUnitId])

  // Listen for new entries added
  useEffect(() => {
    const handleIndicatorAdded = () => {
      if (selectedUnitId) {
        fetchEntries()
      }
    }

    window.addEventListener('indicatorAdded', handleIndicatorAdded)
    return () => window.removeEventListener('indicatorAdded', handleIndicatorAdded)
  }, [selectedUnitId])

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indicator Management (UPDATE & DELETE Operations)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading entries...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Indicator Entries</CardTitle>
        <p className="text-sm text-gray-600">
          View, edit, and delete existing indicator entries
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Database Error:</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-1">Please ensure your Supabase database is configured and the tables exist.</p>
          </div>
        )}

        {units.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Unit:
            </label>
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a unit..." />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-3">
          {entries.length === 0 && !error ? (
            <p className="text-gray-500">No entries found. Add some data using the form above first!</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{entry.indicator_key}</div>
                  <div className="text-sm text-gray-600">{entry.period_start}</div>
                  
                  {editingId === entry.id ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        placeholder="Value"
                        className="w-24"
                      />
                      <Input
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Notes"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="mt-1">
                      <span className="font-semibold text-blue-600">{entry.value}</span>
                      {entry.notes && (
                        <div className="text-sm text-gray-500 mt-1">{entry.notes}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingId === entry.id ? (
                    <>
                      <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEdit(entry)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
