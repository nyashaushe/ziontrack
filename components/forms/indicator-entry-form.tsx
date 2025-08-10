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
  const { selectedUnit } = useUnit()
  const [state, action, pending] = useActionState(async (_prev: any, formData: FormData) => {
    return await createIndicatorEntry(formData)
  }, null)

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="unitId" value={selectedUnit.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Indicator</Label>
          <Select name="indicatorKey" defaultValue={INDICATORS[0].key}>
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
          <Label htmlFor="periodStart">Date (week start)</Label>
          <Input id="periodStart" name="periodStart" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input id="value" name="value" type="number" min={0} required placeholder="0" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" name="notes" rows={3} placeholder="Any context for this entry..." />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={pending} className="bg-purple-600 hover:bg-purple-700">
          {pending ? "Saving..." : "Save Entry"}
        </Button>
      </div>

      {state && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`} role="status" aria-live="polite">
          {state.message}
        </p>
      )}
    </form>
  )
}
