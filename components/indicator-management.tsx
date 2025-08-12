"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export function IndicatorManagement({ unitId }: { unitId: string }) {
  const [entries, setEntries] = useState<IndicatorEntry[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [editNotes, setEditNotes] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  // Fetch entries
  const fetchEntries = async () => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from("indicator_entries")
      .select("*")
      .eq("unit_id", unitId)
      .order("period_start", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching entries:", error)
      toast.error("Failed to load entries")
    } else {
      setEntries(data || [])
    }
    setLoading(false)
  }

  // UPDATE operation
  const updateEntry = async (id: string, value: number, notes: string) => {
    if (!supabase) return

    const { error } = await supabase
      .from("indicator_entries")
      .update({ value, notes })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update entry")
      console.error("Update error:", error)
    } else {
      toast.success("Entry updated successfully")
      setEditingId(null)
      fetchEntries() // Refresh the list
    }
  }

  // DELETE operation
  const deleteEntry = async (id: string) => {
    if (!supabase) return
    if (!confirm("Are you sure you want to delete this entry?")) return

    const { error } = await supabase
      .from("indicator_entries")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete entry")
      console.error("Delete error:", error)
    } else {
      toast.success("Entry deleted successfully")
      fetchEntries() // Refresh the list
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
    fetchEntries()
  }, [unitId])

  if (!supabase) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indicator Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Database not configured - CRUD operations unavailable</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indicator Management</CardTitle>
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
        <CardTitle>Indicator Management</CardTitle>
        <p className="text-sm text-gray-600">
          Demonstrates UPDATE and DELETE operations on cloud database
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-gray-500">No entries found. Add some data first!</p>
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