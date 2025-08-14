import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/user-service"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  
  // If no user, redirect to landing page
  // Allow all demo users (including the default "demo-user" and specific demo accounts)
  if (!currentUser) {
    redirect("/")
  }
  
  return <Dashboard user={currentUser} />
}
