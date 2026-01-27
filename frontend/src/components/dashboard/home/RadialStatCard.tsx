
import { MoreHorizontal } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { RadialStatCardData } from "@/types"

type RadialStatCardProps = RadialStatCardData

export function RadialStatCard({
  title,
  total,
  female,
  male,
}: RadialStatCardProps) {
  const chartData = [{ label: "Patients", female, male }]

  const chartConfig = {
    female: {
      label: "Female",
      color: "#EB5757",
    },
    male: {
      label: "Male",
      color: "#2F80ED",
    },
  }

  return (
    <Card className="w-full h-[195px] rounded-[4.9px] border-0 bg-white p-4 overflow-hidden">
      <CardHeader className="flex flex-row flex-nowrap items-start justify-between gap-3 pb-2 px-0 pt-0 w-full">
        <CardTitle className="text-[21.57px] font-bold leading-[100%] tracking-[0.15%] text-dark font-mukta">
          {title}
        </CardTitle>
        <MoreHorizontal className="h-5 w-5 text-gray-dark shrink-0 mt-0.5" />
      </CardHeader>
      <CardContent className="flex h-full items-start justify-between gap-4 pt-2 px-0 relative">
        <div className="flex flex-col gap-3">
          <div className="text-[37.26px] font-bold leading-[100%] tracking-[0.25%] text-dark font-mukta">
            {total}
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="w-[140px] h-[140px] absolute right-0 -mt-7 [&>div]:!w-full [&>div]:!h-full"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={40}
            outerRadius={65}
            startAngle={90}
            endAngle={-270}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 4}
                          className="fill-foreground text-base font-semibold"
                        >
                          {female} Female
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 14}
                          className="fill-muted-foreground text-sm"
                        >
                          {male} Male
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="female"
              stackId="a"
              cornerRadius={0}
              fill="var(--color-female)"
              className="stroke-transparent stroke-0"
            />
            <RadialBar
              dataKey="male"
              stackId="a"
              cornerRadius={0}
              fill="var(--color-male)"
              className="stroke-transparent stroke-0"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

