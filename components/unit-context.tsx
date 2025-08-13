"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"

export type Unit = {
  id: string
  unit_code: string
  name: string
  type: "ward" | "branch"
  stake: string
}

type UnitContextValue = {
  selectedUnit: Unit | null
  setUnitId: (id: string) => void
  units: Unit[]
  loading: boolean
}

const UnitContext = createContext<UnitContextValue | null>(null)

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<Unit[]>([])
  const [unitId, setUnitIdState] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  // Fetch units from database
  useEffect(() => {
    const fetchUnits = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("units")
          .select("id, unit_code, name, type, stake")
          .order("name")

        if (error) {
          console.error("Error fetching units:", error)
        } else {
          setUnits(data || [])
          
          // Set initial unit ID
          const savedUnitId = typeof window !== "undefined" ? localStorage.getItem("selectedUnitId") : null
          if (savedUnitId && data?.some(u => u.id === savedUnitId)) {
            setUnitIdState(savedUnitId)
          } else if (data && data.length > 0) {
            setUnitIdState(data[0].id)
          }
        }
      } catch (err) {
        console.error("Failed to fetch units:", err)
      }
      
      setLoading(false)
    }

    fetchUnits()
  }, [supabase])

  const setUnitId = (id: string) => {
    setUnitIdState(id)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedUnitId", id)
    }
  }

  const selectedUnit = useMemo(() => {
    return units.find((u) => u.id === unitId) || null
  }, [units, unitId])

  return (
    <UnitContext.Provider value={{ selectedUnit, setUnitId, units, loading }}>
      {children}
    </UnitContext.Provider>
  )
}

export function useUnit() {
  const ctx = useContext(UnitContext)
  if (!ctx) throw new Error("useUnit must be used within UnitProvider")
  return ctx
}
