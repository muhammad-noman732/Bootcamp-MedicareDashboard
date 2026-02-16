import type { GetDashboardStatsResponse } from "@/types/dashboard";
import { api } from "../api";

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<GetDashboardStatsResponse, void>({
            query: () => "/dashboard/stats",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
} = dashboardApi;