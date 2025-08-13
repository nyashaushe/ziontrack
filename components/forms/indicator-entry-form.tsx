"use client"

import { useActionState } from "react"
import { createIndicatorEntry } from "@/app/actions/indicator-actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useUnit } from "@/components/unit-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const INDICATORS = [
  { key: "sacrament_attendance", label: "Sacrament Meeting Attendance" },
  { key: "convert_baptisms", label: "Convert Baptisms" },
  { key: "ministering_interviews", label: "Ministering Interviews" },
  { key: "byu_pathway_enrollment", label: "BYU–Pathway Enrollment" },
  { key: "seminary_institute", label: "Seminary & Institute Enrollments" },
  { key: "temple_recommends", label: "Temple Recommends" },
  { key: "lessons_with_member", label: "Lessons Taught w/ Member" },
]

export function IndicatorEntryForm() {
  const { selectedUnit, units, setUnitId, loading } = useUnit()
  const [state, action, pending] = useActionState(async (_prev: any, formData: FormData) => {
    const result = await createIndicatorEntry(formData)
    // Trigger a page refresh to update the management component
    if (result.ok) {
      window.dispatchEvent(new CustomEvent('indicatorAdded'))
      // Reset form after successful submission
      setTimeout(() => {
        const form = document.querySelector('form') as HTMLFormElement
        if (form) {
          // Reset all form fields except the unit selector
          const inputs = form.querySelectorAll('input[type="date"], input[type="number"], textarea')
          inputs.forEach(input => {
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
              input.value = ''
            }
          })
          // Reset the indicator selector to first option
          const indicatorSelect = form.querySelector('select[name="indicatorKey"]') as HTMLSelectElement
          if (indicatorSelect) {
            indicatorSelect.value = INDICATORS[0].key
          }
        }
      }, 1000) // Wait 1 second to show success message first
    }
    return result
  }, null)

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading units...</div>
  }

  if (!selectedUnit) {
    return <div className="p-4 text-center text-red-500">No units available. Please check your database setup.</div>
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="unitId" value={selectedUnit.id} />
      
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Select Unit:
        </Label>
        <Select value={selectedUnit.id} onValueChange={setUnitId}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="indicatorKey">Indicator *</Label>
          <Select name="indicatorKey" defaultValue={INDICATORS[0].key} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent>
              {INDICATORS.map((i) => (
                <SelectItem key={i.key} value={i.key}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodStart">Date (week start) *</Label>
          <Input 
            id="periodStart" 
            name="periodStart" 
            type="date" 
            required 
            max={new Date().toISOString().split('T')[0]} // Don't allow future dates
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <Input 
            id="value" 
            name="value" 
            type="number" 
            min={0} 
            max={10000}
            required 
            placeholder="Enter a number" 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            rows={3} 
            maxLength={500}
            placeholder="Any context for this entry (max 500 characters)..." 
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            const form = document.querySelector('form') as HTMLFormElement
            if (form) {
              const inputs = form.querySelectorAll('input[type="date"], input[type="number"], textarea')
              inputs.forEach(input => {
                if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                  input.value = ''
                }
              })
            }
          }}
          disabled={pending}
        >
          Clear Form
        </Button>
        
        <Button type="submit" disabled={pending || !selectedUnit} className="bg-purple-600 hover:bg-purple-700">
          {pending ? "Saving..." : "Save Entry"}
        </Button>
      </div>

      {state && (
        <div className={`p-3 rounded border ${
          state.ok 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`} role="status" aria-live="polite">
          <p className="font-medium">
            {state.ok ? "✅ Success!" : "❌ Error"}
          </p>
          <p className="text-sm">{state.message}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Select the appropriate church unit from the dropdown</li>
          <li>Choose the indicator you're reporting on</li>
          <li>Use the Sunday date for weekly reports</li>
          <li>Enter accurate numbers (0-10,000 range)</li>
          <li>Add notes for context if needed</li>
        </ul>
      </div>
    </form>
  )
}
