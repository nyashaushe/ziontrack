"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import type { NavigationItem } from "@/types/navigation"

interface NavigationItemComponentProps {
  item: NavigationItem
  className?: string
}

export function NavigationItemComponent({ item, className }: NavigationItemComponentProps) {
  const pathname = usePathname()
  const isActive = pathname === item.url

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className={className}>
        <Link href={item.url} className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
