import { Loader2 } from "lucide-react";
import { AreaStatCard } from "@/components/dashboard/home/AreaStatCard";
import { RadialStatCard } from "@/components/dashboard/home/RadialStatCard";
import { TasksCard } from "@/components/dashboard/home/TasksCard";
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
        <div className="w-full max-w-[1169px] mx-auto space-y-6 px-[26px] pt-[15px]">
            <div className="text-sm text-[#1D1D1D]">Dashboard &gt; Summary</div>

            <div className="grid gap-[19px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {areaStats.map((stat) => (
                    <AreaStatCard key={stat.title} {...stat} />
                ))}
                <RadialStatCard {...radialStat} />
            </div>

            <div>
                <TasksCard />
            </div>
        </div>
    );
};

export default DashboardHome

