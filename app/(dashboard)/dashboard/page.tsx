import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/user-service"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const currentUser = await getCurrentUser()
  
  // If no user or demo user, redirect to landing page
  if (!currentUser || currentUser.id === "demo-user") {
    redirect("/")
  }
  
  return <Dashboard user={currentUser} />
}