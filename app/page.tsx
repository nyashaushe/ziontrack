import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/user-service"
import LandingPage from "@/components/landing-page"

export default async function HomePage() {
  const currentUser = await getCurrentUser()
  
  // If user is authenticated and has a real account (not demo), redirect to dashboard
  if (currentUser && currentUser.id !== "demo-user") {
    redirect("/dashboard")
  }
  
  return <LandingPage />
}