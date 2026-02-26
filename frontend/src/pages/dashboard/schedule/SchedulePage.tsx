import { ScheduleHeader } from "@/components/dashboard/schedule/ScheduleHeader"
import { ScheduleCalendar } from "@/components/dashboard/schedule/ScheduleCalendar"
import { NewAppointmentModal } from "@/components/dashboard/schedule/NewAppointmentModal"
import { useSchedulePage } from "@/hooks/useSchedulePage"
import { Skeleton } from "@/components/ui/skeleton"

export const SchedulePage = () => {
  const {
    isModalOpen,
    openModal,
    closeModal,
    calendarEvents,
    isLoading,
    dateRangeLabel,
    currentDate,
    handleFilter,
    handlePrint,
    handleHelp,
  } = useSchedulePage()

  return (
    <div className="w-full max-w-[1169px] mx-auto flex flex-col px-[26px] pt-[15px] overflow-y-auto">
      <div className="text-2xl font-normal text-black mb-4">Schedule</div>

      <div className="flex-shrink-0 mb-6">
        <ScheduleHeader
          dateRange={dateRangeLabel}
          onAdd={openModal}
          onFilter={handleFilter}
          onPrint={handlePrint}
          onHelp={handleHelp}
        />
      </div>

      <div className="flex-1 min-h-0">
        <div className="bg-white rounded-lg p-6 h-full">
          {isLoading ? (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-10 w-[250px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="bg-white h-[100px] p-2">
                    <Skeleton className="h-4 w-6 mb-2" />
                    {i % 5 === 0 && <Skeleton className="h-10 w-full rounded-md" />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ScheduleCalendar events={calendarEvents} currentDate={currentDate} />
          )}
        </div>
      </div>

      <NewAppointmentModal open={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default SchedulePage