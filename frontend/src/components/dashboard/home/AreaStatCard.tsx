import { MoreHorizontal } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

  const hasValidData = chartData && chartData.length > 0 && chartData.some(point => point.desktop > 0);

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
            data={hasValidData ? (chartData as ChartPoint[]) : []}
            width={170}
            height={115}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
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
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0, 0, 0, 0.06)" 
              vertical={false}
              horizontal={true}
            />
            <XAxis 
              dataKey="month" 
              hide 
              scale="point"
            />
            <YAxis 
              hide 
              domain={[0, (dataMax: number) => Math.max(dataMax * 1.1, 1)]}
              allowDataOverflow={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill={`url(#${gradientId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              baseValue={0}
              style={{ filter: "none" }}
              isAnimationActive={true}
              connectNulls={true}
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

