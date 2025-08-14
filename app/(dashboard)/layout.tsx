import type React from "react"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getSidebarState } from "@/lib/sidebar-utils"
import { getCurrentUser } from "@/lib/user-service"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import { Toaster } from "sonner"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()
  
  // If no user or demo user, redirect to landing page
  if (!currentUser || currentUser.id === "demo-user") {
    redirect("/")
  }

  const defaultOpen = await getSidebarState()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar userRole={currentUser?.role || "viewer"} />
      <main className="flex-1">
        {children}
      </main>
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm">
        <RealtimeNotifications />
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  )
}
