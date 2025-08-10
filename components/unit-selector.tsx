"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, ChevronDown } from "lucide-react"
import { useUnit } from "./unit-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UnitSelector() {
  const { selectedUnit, units, setUnitId } = useUnit()

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Selected Unit</h2>
        <Badge
          variant="secondary"
          className={selectedUnit.type === "ward" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}
        >
          {selectedUnit.type}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
          <Building2 className="h-6 w-6 text-purple-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{selectedUnit.name}</h3>
          <p className="text-sm text-gray-600">{selectedUnit.stake} • Africa South Area</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Change Unit <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Harare Zimbabwe Stake (9)</DropdownMenuLabel>
            {units.map((u) => (
              <DropdownMenuItem key={u.id} onClick={() => setUnitId(u.id)}>
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${u.type === "ward" ? "bg-blue-500" : "bg-purple-500"}`} />
                  <div className="flex flex-col">
                    <span className="font-medium">{u.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{u.type}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
