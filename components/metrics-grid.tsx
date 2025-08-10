import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Calendar, GraduationCap, BookOpen, MapPin, Award, FileText } from "lucide-react"

const metrics = [
  {
    title: "Sacrament Meeting Attendance",
    icon: Users,
    value: 0,
    goal: 150,
    change: 5,
    changeType: "increase" as const,
    period: "vs last month",
    description: "Weekly average attendance",
    status: "critical" as const,
  },
  {
    title: "Convert Baptisms",
    icon: Heart,
    value: 0,
    goal: 3,
    change: -2,
    changeType: "decrease" as const,
    period: "vs last month",
    description: "This quarter",
    status: "critical" as const,
  },
  {
    title: "Ministering Interviews",
    icon: Calendar,
    value: 0,
    goal: 50,
    change: 8,
    changeType: "increase" as const,
    period: "vs last month",
    description: "Monthly interviews completed",
    status: "critical" as const,
  },
  {
    title: "BYU-Pathway Enrollment",
    icon: GraduationCap,
    value: 0,
    goal: 15,
    change: 12,
    changeType: "increase" as const,
    period: "vs last month",
    description: "Active students",
    status: "critical" as const,
  },
  {
    title: "Seminary/Institute",
    icon: BookOpen,
    value: 0,
    goal: 25,
    change: 0,
    changeType: "neutral" as const,
    period: "vs last month",
    description: "Total enrollment",
    status: "critical" as const,
  },
  {
    title: "Missionaries Serving",
    icon: MapPin,
    value: 0,
    goal: 8,
    change: 0,
    changeType: "neutral" as const,
    period: "vs last month",
    description: "Full-time missionaries",
    status: "critical" as const,
  },
  {
    title: "Temple Recommends",
    icon: Award,
    value: 0,
    goal: 75,
    change: 0,
    changeType: "neutral" as const,
    period: "vs last month",
    description: "Current valid recommends",
    status: "critical" as const,
  },
  {
    title: "Names Submitted",
    icon: FileText,
    value: 0,
    goal: 20,
    change: 0,
    changeType: "neutral" as const,
    period: "vs last month",
    description: "Temple work submissions",
    status: "critical" as const,
  },
]

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <metric.icon className="h-4 w-4 text-gray-600" />
              {metric.title}
            </CardTitle>
            <Badge variant="destructive" className="text-xs bg-red-100 text-red-700 hover:bg-red-100">
              Critical
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">/ {metric.goal} goal</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`flex items-center gap-1 ${
                    metric.changeType === "increase"
                      ? "text-green-600"
                      : metric.changeType === "decrease"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {metric.changeType === "increase" && "↗"}
                  {metric.changeType === "decrease" && "↘"}
                  {metric.change !== 0 && `${Math.abs(metric.change)}%`} {metric.period}
                </span>
              </div>

              <p className="text-xs text-gray-600">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
