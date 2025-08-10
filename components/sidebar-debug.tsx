"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface SidebarDebugProps {
  userRole?: string
}

export function SidebarDebug({ userRole }: SidebarDebugProps) {
  const { state, open, isMobile } = useSidebar()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <div className="flex gap-2">
        <Badge variant="outline">State: {state}</Badge>
        <Badge variant="outline">Open: {open ? "Yes" : "No"}</Badge>
        <Badge variant="outline">Mobile: {isMobile ? "Yes" : "No"}</Badge>
      </div>
      {userRole && (
        <Badge variant="outline" className="self-center">
          Role: {userRole}
        </Badge>
      )}
    </div>
  )
}
