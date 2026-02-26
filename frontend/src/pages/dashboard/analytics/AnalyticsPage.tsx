import { AnalyticsCards } from "@/components/dashboard/analytics/AnalyticsCards";
import { TrendsChart } from "@/components/dashboard/analytics/TrendsChart";
import { PatientDistribution } from "@/components/dashboard/analytics/PatientDistribution";
import { DemographicsChart } from "@/components/dashboard/analytics/DemographicsChart";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
    const { analytics, isLoading, isError, refetch, isFetching } = useAnalytics();

    if (isLoading) {
        return (
            <div className="p-6 space-y-8 animate-in fade-in duration-500 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-[250px] mb-2 rounded-md" />
                        <Skeleton className="h-5 w-[350px] rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-[120px] rounded-md" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>

                <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
        );
    }

    if (isError || !analytics) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Failed to load analytics data.</p>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            </div>
        );
    }

    const { summary, patientStatus, appointmentTrends, genderDistribution, ageGroups } = analytics;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clinical Analytics</h1>
                    <p className="text-muted-foreground">Insights into your practice performance and patient demographics.</p>
                </div>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    size="sm"
                    disabled={isFetching}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    {isFetching ? 'Updating...' : 'Refresh Data'}
                </Button>
            </div>

            <AnalyticsCards summary={summary} />

            <div className="grid gap-6 lg:grid-cols-2">
                <TrendsChart data={appointmentTrends} />
                <DemographicsChart data={ageGroups} />
            </div>

            <PatientDistribution
                statusData={patientStatus}
                genderData={genderDistribution}
            />
        </div>
    );
}