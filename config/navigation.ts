import { Home, FileText, BarChart3, Users, Settings, Target, UserCheck, Award, BookOpen, MapPin } from "lucide-react"
import type { NavigationItem, NavigationGroup } from "@/types/navigation"

export const mainNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    requiredPermissions: ["view-dashboard"],
    description: "Overview of key metrics and indicators",
  },
  {
    title: "Data Entry",
    icon: FileText,
    url: "/data-entry",
    requiredPermissions: ["edit-all-data", "edit-own-data"],
    description: "Submit monthly and quarterly data",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/analytics",
    requiredPermissions: ["view-analytics"],
    description: "Detailed insights and trends",
  },
  {
    title: "Stake Rollup",
    icon: BarChart3,
    url: "/rollup",
    requiredPermissions: ["view-analytics"],
    description: "Compare units and export summaries",
  },
  {
    title: "Units",
    icon: Users,
    url: "/units",
    requiredPermissions: ["view-all-units", "view-own-unit", "view-assigned-units"],
    description: "Manage and view unit information",
  },
]

export const stakeLeaderNavigation: NavigationItem[] = [
  {
    title: "Advanced Analytics",
    icon: BarChart3,
    url: "/advanced-analytics",
    requiredPermissions: ["view-advanced-analytics"],
    description: "Comprehensive stake-wide analysis",
  },
  {
    title: "User Management",
    icon: UserCheck,
    url: "/user-management",
    requiredPermissions: ["manage-users"],
    description: "Manage user roles and permissions",
  },
  {
    title: "Goal Management",
    icon: Target,
    url: "/goal-management",
    requiredPermissions: ["manage-goals"],
    description: "Set and track stake goals",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
    requiredPermissions: ["manage-users"],
    description: "System configuration and preferences",
  },
]

export const areaPriorities: NavigationGroup[] = [
  {
    title: "Self Reliance",
    requiredPermissions: ["view-area-priorities"],
    items: [
      {
        title: "Back to Gospel Basics",
        icon: BookOpen,
        url: "/priorities/gospel-basics",
        requiredPermissions: ["view-area-priorities"],
      },
      {
        title: "My Path for Self Reliance",
        icon: Target,
        url: "/priorities/self-reliance-path",
        requiredPermissions: ["view-area-priorities"],
      },
    ],
  },
  {
    title: "Sharing the Gospel",
    requiredPermissions: ["view-area-priorities"],
    items: [
      {
        title: "Love, Share, and Invite",
        icon: Award,
        url: "/priorities/love-share-invite",
        requiredPermissions: ["view-area-priorities"],
      },
      {
        title: "My Covenant Path",
        icon: MapPin,
        url: "/priorities/covenant-path",
        requiredPermissions: ["view-area-priorities"],
      },
    ],
  },
  {
    title: "The House of the Lord",
    requiredPermissions: ["view-area-priorities"],
    items: [
      {
        title: "Recommended to the Lord",
        icon: Award,
        url: "/priorities/temple-recommends",
        requiredPermissions: ["view-area-priorities"],
      },
      {
        title: "My Family Booklet",
        icon: BookOpen,
        url: "/priorities/family-booklet",
        requiredPermissions: ["view-area-priorities"],
      },
    ],
  },
]

export const managementPriorities: NavigationGroup[] = [
  {
    title: "Area Management",
    requiredPermissions: ["manage-area-priorities"],
    items: [
      {
        title: "Priority Settings",
        icon: Settings,
        url: "/management/priorities",
        requiredPermissions: ["manage-area-priorities"],
      },
      {
        title: "Goal Templates",
        icon: Target,
        url: "/management/goal-templates",
        requiredPermissions: ["manage-area-priorities"],
      },
    ],
  },
]
