"use client"

import { Building2, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavigationItemComponent } from "@/components/navigation-item"
import { hasAnyPermission } from "@/lib/permissions"
import { mainNavigation, stakeLeaderNavigation, areaPriorities, managementPriorities } from "@/config/navigation"
import type { UserRole } from "@/types/user"

interface AppSidebarProps {
  userRole: UserRole
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  // Filter navigation items based on permissions
  const visibleMainNav = mainNavigation.filter((item) => hasAnyPermission(userRole, item.requiredPermissions))

  const visibleStakeLeaderNav = stakeLeaderNavigation.filter((item) =>
    hasAnyPermission(userRole, item.requiredPermissions),
  )

  const visibleAreaPriorities = areaPriorities
    .filter((group) => !group.requiredPermissions || hasAnyPermission(userRole, group.requiredPermissions))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasAnyPermission(userRole, item.requiredPermissions)),
    }))
    .filter((group) => group.items.length > 0)

  const visibleManagementPriorities = managementPriorities
    .filter((group) => !group.requiredPermissions || hasAnyPermission(userRole, group.requiredPermissions))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasAnyPermission(userRole, item.requiredPermissions)),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Zion Track</h2>
            <p className="text-sm text-gray-600">Church Leadership Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMainNav.map((item) => (
                <NavigationItemComponent key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stake Leader Only Navigation */}
        {visibleStakeLeaderNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-purple-600 uppercase tracking-wider">
              Stake Leadership
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleStakeLeaderNav.map((item) => (
                  <NavigationItemComponent
                    key={item.title}
                    item={item}
                    className="text-purple-700 hover:text-purple-800"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Area Priorities */}
        {visibleAreaPriorities.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Area Priorities
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleAreaPriorities.map((priority) => (
                  <Collapsible key={priority.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between">
                          <span className="text-sm font-medium text-purple-700">{priority.title}</span>
                          <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {priority.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={item.url} className="text-sm text-purple-600 flex items-center gap-2">
                                  <item.icon className="h-3 w-3" />
                                  {item.title}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Management Priorities (Stake Leaders Only) */}
        {visibleManagementPriorities.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-red-600 uppercase tracking-wider">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleManagementPriorities.map((priority) => (
                  <Collapsible key={priority.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between">
                          <span className="text-sm font-medium text-red-700">{priority.title}</span>
                          <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {priority.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={item.url} className="text-sm text-red-600 flex items-center gap-2">
                                  <item.icon className="h-3 w-3" />
                                  {item.title}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
