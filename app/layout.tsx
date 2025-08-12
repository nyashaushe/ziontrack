import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { UnitProvider } from "@/components/unit-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zion Track - Church Leadership Dashboard",
  description: "Track and manage key spiritual and administrative indicators for Church units",
    generator: 'v0.dev'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UnitProvider>
          {children}
          <Toaster />
        </UnitProvider>
      </body>
    </html>
  )
}
