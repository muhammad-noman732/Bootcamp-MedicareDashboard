import { api } from "../api";
import type { ApiResponse } from "@/types/api";
import type { AnalyticsData } from "@/types/analytics";

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardAnalytics: builder.query<ApiResponse<AnalyticsData>, void>({
            query: () => "/analytics/dashboard",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardAnalyticsQuery } = analyticsApi;
