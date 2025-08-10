import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const progressData = [
  {
    title: "Sacrament Meeting Attendance",
    current: 0,
    goal: 150,
    percentage: 0,
  },
  {
    title: "Ministering Interviews",
    current: 0,
    goal: 50,
    percentage: 0,
  },
  {
    title: "Convert Baptisms",
    current: 0,
    goal: 3,
    percentage: 0,
  },
  {
    title: "BYU-Pathway Enrollment",
    current: 0,
    goal: 15,
    percentage: 0,
  },
]

export function MonthlyProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Monthly Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {progressData.map((item) => (
          <div key={item.title} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">{item.title}</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {item.current}/{item.goal}
                </span>
                <span className="text-sm text-gray-500">{item.percentage}% of goal</span>
              </div>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
