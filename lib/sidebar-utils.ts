"use server"

import { cookies } from "next/headers"
import { getUserRole } from "./user-service"
import { ROLE_CONFIGS } from "@/types/user"

export async function getSidebarState(): Promise<boolean> {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar:state")

  // If user has explicitly set a preference, use that
  if (sidebarState?.value !== undefined) {
    return sidebarState.value === "true"
  }

  // Otherwise, use role-based default
  const userRole = await getUserRole()
  const roleConfig = ROLE_CONFIGS[userRole]

  return roleConfig.defaultSidebarOpen
}

export async function setSidebarState(isOpen: boolean) {
  const cookieStore = await cookies()

  cookieStore.set("sidebar:state", isOpen.toString(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
}

export async function resetSidebarToRoleDefault() {
  const cookieStore = await cookies()

  // Clear the explicit preference
  cookieStore.set("sidebar:state", "", {
    path: "/",
    expires: new Date(0),
  })
}
