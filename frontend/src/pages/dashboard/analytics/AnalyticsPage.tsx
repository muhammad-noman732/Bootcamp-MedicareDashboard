import { AnalyticsCards } from "@/components/dashboard/analytics/AnalyticsCards";
import { TrendsChart } from "@/components/dashboard/analytics/TrendsChart";
import { PatientDistribution } from "@/components/dashboard/analytics/PatientDistribution";
import { DemographicsChart } from "@/components/dashboard/analytics/DemographicsChart";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
    const { analytics, isLoading, isError, refetch, isFetching } = useAnalytics();

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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