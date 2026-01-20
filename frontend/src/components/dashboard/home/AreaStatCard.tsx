import { MoreHorizontal } from "lucide-react"
import { Area, AreaChart } from "recharts"

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
import { cn } from "@/lib/utils"
import type { AreaStatCardData, ChartPoint } from "@/types"

type AreaStatCardProps = AreaStatCardData

export function AreaStatCard({
  title,
  value,
  deltaLabel,
  deltaType = "positive",
  chartData,
  strokeColor,
  strokeWidth,
  gradientId,
  gradientStops,
}: AreaStatCardProps) {
  const chartConfig = {
    desktop: {
      label: title,
      color: strokeColor,
    },
  }

  const element = document.getElementById("name")
  console.log(element);


  return (
    <Card className="w-full h-[195px] rounded-[4.9px] border-0 bg-white p-4">
      <CardHeader className="flex flex-row flex-nowrap items-start justify-between gap-3 pb-2 px-0 pt-0 w-full">
        <CardTitle className="text-[21.57px] font-medium leading-[100%] tracking-[0.15%] text-[#1D1D1D]">
          {title}
        </CardTitle>
        <MoreHorizontal className="h-5 w-5 text-[#222222] shrink-0 mt-0.5" />
      </CardHeader>
      <CardContent className="flex h-full items-start justify-between gap-4 pt-2 px-0">
        <div className="flex flex-col gap-3">
          <div className="text-[37.26px] font-bold leading-[100%] tracking-[0.25%] text-black">
            {value}
          </div>
          <h1 id="name">title</h1>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-[22px] w-[22px] mt-6 items-center justify-center rounded-full text-white",
                deltaType === "positive" ? "bg-[#27AE60]" : "bg-[#EB5757]"
              )}
              aria-hidden
            >
              <svg
                width="5.72"
                height="8"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-100"
              >
                <path
                  d="M4 11V1M4 1L1 4M4 1L7 4"
                  stroke="white"
                  strokeWidth="1.96"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={cn(
                "text-[15.69px] font-bold leading-[100%] mt-6 tracking-[0.25%]",
                deltaType === "positive" ? "text-[#27AE60]" : "text-[#EB5757]"
              )}
            >
              {deltaLabel}
            </span>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="w-[170px] h-[115px] -mt-7 [&>div]:!w-full [&>div]:!h-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData as ChartPoint[]}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {gradientStops.map((stop) => (
                  <stop
                    key={stop.offset}
                    offset={`${stop.offset}%`}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill={`url(#${gradientId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              style={{ filter: "none" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

