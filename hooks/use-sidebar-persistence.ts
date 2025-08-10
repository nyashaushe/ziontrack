"use client"

import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export function useSidebarPersistence() {
  const { open, setOpen } = useSidebar()

  // Additional client-side persistence logic if needed
  useEffect(() => {
    // Listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sidebar:state" && e.newValue !== null) {
        setOpen(e.newValue === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [setOpen])

  // Function to manually toggle and persist
  const toggleWithPersistence = () => {
    const newState = !open
    setOpen(newState)

    // Also store in localStorage for cross-tab sync
    localStorage.setItem("sidebar:state", newState.toString())
  }

  return {
    open,
    setOpen,
    toggleWithPersistence,
  }
}
