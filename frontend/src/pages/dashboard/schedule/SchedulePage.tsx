import { useState } from "react"
import { ScheduleHeader } from "@/components/dashboard/schedule/ScheduleHeader"
import { ScheduleCalendar } from "@/components/dashboard/schedule/ScheduleCalendar"
import { NewAppointmentModal } from "@/components/dashboard/schedule/NewAppointmentModal"

export const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log("Filter clicked")
  }

  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log("Print clicked")
  }

  const handleHelp = () => {
    // TODO: Implement help functionality
    console.log("Help clicked")
  }

  // TODO: Calculate date range based on current week
  const dateRange = "Weekly schedule from 25th to 1st November 2022"

  return (
    <div className="w-full max-w-[1169px] mx-auto flex flex-col px-[26px] pt-[15px] overflow-y-auto">
      <div className="text-2xl font-normal text-black mb-4">Schedule</div>

      <div className="flex-shrink-0 mb-6">
        <ScheduleHeader
          dateRange={dateRange}
          onAdd={() => setIsModalOpen(true)}
          onFilter={handleFilter}
          onPrint={handlePrint}
          onHelp={handleHelp}
        />
      </div>

      <div className="flex-1 min-h-0">
        <div className="bg-white rounded-lg p-6 h-full">
          <ScheduleCalendar />
        </div>
      </div>

      <NewAppointmentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default SchedulePage

