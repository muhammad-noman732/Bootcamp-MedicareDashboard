import { AreaStatCard } from "@/components/dashboard/home/AreaStatCard"
import { RadialStatCard } from "@/components/dashboard/home/RadialStatCard"
import { TasksCard } from "@/components/dashboard/home/TasksCard"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useTasks } from "@/hooks/useTasks"

export const DashboardHome = () => {
  const { areaStats, radialStat } = useDashboardStats()
  const { tasks } = useTasks()

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
        <TasksCard tasks={tasks} />
      </div>
    </div>
  )
}

export default DashboardHome

