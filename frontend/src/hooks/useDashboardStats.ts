import { useMemo } from "react";
import { useGetDashboardStatsQuery } from "@/lib/store/services/dashboard/dashboardApi";
import type { AreaStatCardData, ChartPoint, RadialStatCardData } from "@/types";

export function useDashboardStats() {
    const { data, isLoading } = useGetDashboardStatsQuery();

    const areaStats: AreaStatCardData[] = useMemo(() => {
        if (!data?.data) {
            return [
                {
                    title: "Offline Consultations",
                    value: 0,
                    deltaLabel: "0%",
                    deltaType: "positive",
                    chartData: [],
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
                    value: 0,
                    deltaLabel: "0%",
                    deltaType: "positive",
                    chartData: [],
                    strokeColor: "#EB5757",
                    strokeWidth: 0.87,
                    gradientId: "gradientOnline",
                    gradientStops: [
                        { offset: 0, color: "#EB5757", opacity: 1 },
                        { offset: 100, color: "rgba(226, 185, 59, 0)", opacity: 0 },
                    ],
                },
            ];
        }

        const { consultations } = data.data;

        const offlineChartData: ChartPoint[] =
            consultations.offline.chartData && consultations.offline.chartData.length > 0
                ? consultations.offline.chartData.map((point) => ({
                      month: point.month,
                      desktop: typeof point.value === "number" ? point.value : 0,
                  }))
                : [];

        const onlineChartData: ChartPoint[] =
            consultations.online.chartData && consultations.online.chartData.length > 0
                ? consultations.online.chartData.map((point) => ({
                      month: point.month,
                      desktop: typeof point.value === "number" ? point.value : 0,
                  }))
                : [];

        const offlineDeltaType: "positive" | "negative" =
            consultations.offline.trend.startsWith("+") || consultations.offline.trend === "0%"
                ? "positive"
                : "negative";

        const onlineDeltaType: "positive" | "negative" =
            consultations.online.trend.startsWith("+") || consultations.online.trend === "0%"
                ? "positive"
                : "negative";

        return [
            {
                title: "Offline Consultations",
                value: consultations.offline.count,
                deltaLabel: consultations.offline.trend,
                deltaType: offlineDeltaType,
                chartData: offlineChartData,
                strokeColor: "#2F80ED",
                strokeWidth: 0.98,
                gradientId: "gradientOffline",
                gradientStops: [
                    { offset: 0, color: "#2F80ED", opacity: 0.8 },
                    { offset: 50, color: "#2F80ED", opacity: 0.3 },
                    { offset: 100, color: "#2F80ED", opacity: 0 },
                ],
            },
            {
                title: "Online Consultations",
                value: consultations.online.count,
                deltaLabel: consultations.online.trend,
                deltaType: onlineDeltaType,
                chartData: onlineChartData,
                strokeColor: "#EB5757",
                strokeWidth: 0.87,
                gradientId: "gradientOnline",
                gradientStops: [
                    { offset: 0, color: "#EB5757", opacity: 0.8 },
                    { offset: 50, color: "#EB5757", opacity: 0.3 },
                    { offset: 100, color: "#EB5757", opacity: 0 },
                ],
            },
        ];
    }, [data]);

    const radialStat: RadialStatCardData = useMemo(() => {
        if (!data?.data) {
            return {
                title: "Total Patients",
                total: 0,
                female: 0,
                male: 0,
            };
        }

        return {
            title: "Total Patients",
            total: data.data.patients.total,
            female: data.data.patients.female,
            male: data.data.patients.male,
        };
    }, [data]);

    return {
        areaStats,
        radialStat,
        isLoading,
    };
}

