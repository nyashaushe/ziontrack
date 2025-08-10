"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { UNITS, type Unit } from "@/lib/constants/units"

type UnitContextValue = {
  selectedUnit: Unit
  setUnitId: (id: string) => void
  units: Unit[]
}

const UnitContext = createContext<UnitContextValue | null>(null)

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unitId, setUnitIdState] = useState<string>(() => {
    if (typeof window === "undefined") return UNITS[0].id
    return localStorage.getItem("selectedUnitId") || UNITS[0].id
  })

  const setUnitId = (id: string) => {
    setUnitIdState(id)
    if (typeof window !== "undefined") localStorage.setItem("selectedUnitId", id)
  }

  const selectedUnit = useMemo(() => UNITS.find((u) => u.id === unitId) || UNITS[0], [unitId])

  useEffect(() => {
    // keep in sync if units change (unlikely here)
  }, [])

  return <UnitContext.Provider value={{ selectedUnit, setUnitId, units: UNITS }}>{children}</UnitContext.Provider>
}

export function useUnit() {
  const ctx = useContext(UnitContext)
  if (!ctx) throw new Error("useUnit must be used within UnitProvider")
  return ctx
}
