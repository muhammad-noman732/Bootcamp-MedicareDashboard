import { Skeleton } from "@/components/ui/skeleton";
import { AreaStatCard } from "@/components/dashboard/home/AreaStatCard";
import { RadialStatCard } from "@/components/dashboard/home/RadialStatCard";
import { TasksCard } from "@/components/dashboard/home/TasksCard";
import { UpcomingScheduleCard } from "@/components/dashboard/home/UpcomingScheduleCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export const DashboardHome = () => {
    const { areaStats, radialStat, isLoading } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="w-full mx-auto space-y-6 px-4 lg:px-[28.44px] pt-[15px] pb-10 overflow-x-hidden">
                <div className="text-sm text-[#1D1D1D] font-medium opacity-80">Dashboard &gt; Summary</div>
                <div className="grid gap-[19px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1170.86px]">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[132px] w-full rounded-[14px] bg-white p-4 shadow-sm space-y-3">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-[19.61px] items-start w-full max-w-full overflow-hidden">
                    <div className="flex-1 max-w-[570px] min-h-[611.91px] rounded-[4.9px] bg-white p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-lg" />
                        ))}
                    </div>
                    <div className="flex-[0_0_auto] w-full max-w-[384.41px] min-h-[624.66px] rounded-[4.9px] bg-white p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto space-y-6 px-4 lg:px-[28.44px] pt-[15px] pb-10 overflow-x-hidden">
            <div className="text-sm text-[#1D1D1D] font-medium opacity-80">Dashboard &gt; Summary</div>

            <div className="grid gap-[19px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1170.86px]">
                {areaStats.map((stat) => (
                    <AreaStatCard key={stat.title} {...stat} />
                ))}
                <RadialStatCard {...radialStat} />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap gap-[19.61px] items-start w-full max-w-full overflow-hidden">
                <TasksCard />
                <UpcomingScheduleCard />
            </div>
        </div>
    );



};


export default DashboardHome
