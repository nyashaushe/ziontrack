import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { getSidebarState } from "@/lib/sidebar-utils"
import { getCurrentUser } from "@/lib/user-service"
import { UnitProvider } from "@/components/unit-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zion Track - Church Leadership Dashboard",
  description: "Track and manage key spiritual and administrative indicators for Church units",
    generator: 'v0.dev'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = await getSidebarState()
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar userRole={currentUser?.role || "viewer"} />
          <UnitProvider>{children}</UnitProvider>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
