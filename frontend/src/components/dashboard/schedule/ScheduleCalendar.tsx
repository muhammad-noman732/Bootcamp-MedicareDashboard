import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Clock, FileText, MapPin, User } from 'lucide-react'
import type { EventContentArg } from '@fullcalendar/core'

interface CalendarEvent {
    id: string
    title: string
    start: string | Date
    end?: string | Date
    extendedProps: {
        type: string
        location: string
        status: string
        variant: string
        purpose?: string | null
        room?: string
        isOnline?: boolean
    }
}

interface ScheduleCalendarProps {
    events?: CalendarEvent[]
    currentDate?: Date
}

export const ScheduleCalendar = ({ events = [], currentDate = new Date() }: ScheduleCalendarProps) => {

    const renderEventContent = (eventInfo: EventContentArg) => {
        const { extendedProps } = eventInfo.event
        const { variant, status, type, location } = extendedProps

        const palettes = {
            red: { solid: '#EB5757', bg: 'rgba(235, 87, 87, 0.1)', header: 'rgba(235, 87, 87, 0.2)' },
            blue: { solid: '#2F80ED', bg: 'rgba(47, 128, 237, 0.1)', header: 'rgba(47, 128, 237, 0.2)' },
            yellow: { solid: '#E2B93B', bg: 'rgba(226, 185, 59, 0.1)', header: 'rgba(226, 185, 59, 0.2)' }
        };

        const style = palettes[variant as keyof typeof palettes] || palettes.red;

        return (
            <div
                className="w-full h-full rounded-lg flex flex-col overflow-hidden font-mukta shadow-sm"
                style={{ backgroundColor: style.bg }}
            >
                <div
                    className="px-2 py-1 flex items-center relative"
                    style={{ backgroundColor: style.header }}
                >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-[65%] rounded-r-full" style={{ backgroundColor: style.solid }}></div>
                    <span className="ml-2 text-[13px] font-bold" style={{ color: style.solid }}>{status}</span>
                </div>

                <div className="p-1.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <User size={12} style={{ color: style.solid }} strokeWidth={2.5} />
                        <span className="truncate font-bold text-xs" style={{ color: style.solid }}>{eventInfo.event.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <FileText size={12} style={{ color: style.solid }} strokeWidth={2.5} />
                        <span className="truncate text-xs font-semibold" style={{ color: style.solid }}>{type}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock size={12} style={{ color: style.solid }} strokeWidth={2.5} />
                        <span className="text-xs font-bold" style={{ color: style.solid }}>{eventInfo.timeText}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} style={{ color: style.solid }} strokeWidth={2.5} />
                        <span className="truncate text-xs font-semibold" style={{ color: style.solid }}>{location}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderHeader = (arg: { date: Date }) => {
        const dayName = arg.date.toLocaleDateString('en-US', { weekday: 'short' })
        const dayNumber = arg.date.getDate()

        return (
            <div className="h-[90px] flex items-center justify-center font-bold">
                {dayName}({dayNumber})
            </div>
        )
    }

    return (
        <div className='schedule-calendar h-full w-full 
            [&_.fc-event]:!bg-transparent [&_.fc-event]:!border-none [&_.fc-event]:!shadow-none
            [&_.fc-v-event]:!bg-transparent [&_.fc-v-event]:!border-none [&_.fc-v-event]:!shadow-none
            [&_.fc-timegrid-event-harness]:!m-0
            [&_.fc-timegrid-event]:!m-0
            [&_.fc-event-time]:hidden [&_.fc-event-title]:hidden
            [&_.fc-col-header-cell]:bg-white [&_.fc-col-header-cell]:border-gray-100 [&_.fc-col-header-cell]:border-x
            [&_.fc-scrollgrid]:!border-none
            [&_.fc-timegrid-slot]:border-gray-50
            [&_.fc-timegrid-divider]:hidden
            [&_.fc-col-header]:!border-none
            [&_.fc-col-header-cell]:!min-w-[350px] 
            [&_.fc-timegrid-col]:!min-w-[350px]
        '>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                initialDate={currentDate.toISOString().split('T')[0]}
                firstDay={1}
                headerToolbar={false}
                dayHeaderContent={renderHeader}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                allDaySlot={false}
                slotMinTime="07:00:00"
                slotMaxTime="20:00:00"
                expandRows={true}
                events={events}
                eventContent={renderEventContent}
                eventMinHeight={140}
                slotDuration="01:00:00"
                slotLabelInterval="01:00"
                contentHeight="2200px"
                dayHeaderClassNames="py-0 text-dark font-bold text-base font-mukta"
                slotLabelClassNames="text-sm text-gray-3 font-medium pr-3 font-mukta"
            />
        </div>
    )
}