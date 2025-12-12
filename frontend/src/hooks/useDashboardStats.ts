import { useMemo } from "react"

import type { AreaStatCardData, ChartPoint, RadialStatCardData } from "@/types"

export function useDashboardStats() {
  const areaChartData: ChartPoint[] = useMemo(
    () => [
      { month: "January", desktop: 186 },
      { month: "February", desktop: 305 },
      { month: "March", desktop: 237 },
      { month: "April", desktop: 73 },
      { month: "May", desktop: 209 },
      { month: "June", desktop: 214 },
    ],
    []
  )

  const areaStats: AreaStatCardData[] = useMemo(
    () => [
      {
        title: "Offline Consultations",
        value: 101,
        deltaLabel: "+3.11%",
        deltaType: "positive",
        chartData: areaChartData,
        strokeColor: "#2F80ED",
        strokeWidth: 0.98,
        gradientId: "gradientOffline",
        gradientStops: [
          { offset: 0, color: "#2F80ED", opacity: 1 },
          { offset: 100, color: "rgba(217, 217, 217, 0)", opacity: 0 },
        ],
      },
      {
        title: "Online Consultations",
        value: 96,
        deltaLabel: "-20.9%",
        deltaType: "negative",
        chartData: areaChartData,
        strokeColor: "#EB5757",
        strokeWidth: 0.87,
        gradientId: "gradientOnline",
        gradientStops: [
          { offset: 0, color: "#EB5757", opacity: 1 },
          { offset: 100, color: "rgba(226, 185, 59, 0)", opacity: 0 },
        ],
      },
    ],
    [areaChartData]
  )

  const radialStat: RadialStatCardData = useMemo(
    () => ({
      title: "Total Patients",
      total: 197,
      female: 110,
      male: 87,
    }),
    []
  )

  return { areaStats, radialStat }
}

