import { useGetDashboardAnalyticsQuery } from "@/lib/store/services/analytics/analyticsApi";
import { useEffect } from "react";
import { toast } from "sonner";

export const useAnalytics = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching
    } = useGetDashboardAnalyticsQuery();

    useEffect(() => {
        if (isError && error) {
            toast.error("Analytics Error", {
                description: "Failed to load latest clinical insights. Please try again."
            });
            console.error("Analytics fetch error:", error);
        }
    }, [isError, error]);

    return {
        analytics: data?.data,
        isLoading: isLoading,
        isFetching,
        isError,
        refetch
    };
};
