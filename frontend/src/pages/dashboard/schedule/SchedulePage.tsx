import { useState } from "react"
import { ScheduleHeader } from "@/components/dashboard/schedule/ScheduleHeader"
import { ScheduleCalendar } from "@/components/dashboard/schedule/ScheduleCalendar"
import { NewAppointmentModal } from "@/components/dashboard/schedule/NewAppointmentModal"
import { useAppointments } from "@/hooks/useAppointments"

export const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { calendarEvents, isLoading, dateRangeLabel, currentDate } = useAppointments()

  const handleFilter = () => {
    console.log("Filter clicked")
  }

  const handlePrint = () => {
    console.log("Print clicked")
  }

  const handleHelp = () => {
    console.log("Help clicked")
  }

  return (
    <div className="w-full max-w-[1169px] mx-auto flex flex-col px-[26px] pt-[15px] overflow-y-auto">
      <div className="text-2xl font-normal text-black mb-4">Schedule</div>

      <div className="flex-shrink-0 mb-6">
        <ScheduleHeader
          dateRange={dateRangeLabel}
          onAdd={() => setIsModalOpen(true)}
          onFilter={handleFilter}
          onPrint={handlePrint}
          onHelp={handleHelp}
        />
      </div>

      <div className="flex-1 min-h-0">
        <div className="bg-white rounded-lg p-6 h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading appointments...</p>
              </div>
            </div>
          ) : (
            <ScheduleCalendar events={calendarEvents} currentDate={currentDate} />
          )}
        </div>
      </div>

      <NewAppointmentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default SchedulePage
