import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CardSkeleton() {
  return (
    <Card className="bg-white/70 backdrop-blur-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="h-4 w-1/2 bg-gray-200 rounded"></CardTitle>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="bg-white/70 backdrop-blur-lg p-6">
      <CardHeader>
        <CardTitle className="h-6 w-1/4 bg-gray-200 rounded"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

