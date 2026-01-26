import { Loader2 } from "lucide-react";
import { AreaStatCard } from "@/components/dashboard/home/AreaStatCard";
import { RadialStatCard } from "@/components/dashboard/home/RadialStatCard";
import { TasksCard } from "@/components/dashboard/home/TasksCard";
import { UpcomingScheduleCard } from "@/components/dashboard/home/UpcomingScheduleCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export const DashboardHome = () => {
    const { areaStats, radialStat, isLoading } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="w-full max-w-[1169px] mx-auto space-y-6 px-[26px] pt-[15px]">
                <div className="text-sm text-[#1D1D1D]">Dashboard &gt; Summary</div>
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

