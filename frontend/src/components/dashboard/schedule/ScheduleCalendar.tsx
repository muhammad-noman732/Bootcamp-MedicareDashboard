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

        const styles = {
            red: {
                bg: 'bg-[#FFE5E5]',
                border: 'border-l-[4px] border-l-[#EB5757]',
                text: 'text-[#EB5757]',
                badge: 'bg-[#EB5757] text-white'
            },
            green: {
                bg: 'bg-[#E8F5E9]',
                border: 'border-l-[4px] border-l-[#27AE60]',
                text: 'text-[#27AE60]',
                badge: 'bg-[#27AE60] text-white'
            },
            blue: {
                bg: 'bg-[#E3F2FD]',
                border: 'border-l-[4px] border-l-[#2F80ED]',
                text: 'text-[#2F80ED]',
                badge: 'bg-[#2F80ED] text-white'
            },
            yellow: {
                bg: 'bg-[#FFF9E6]',
                border: 'border-l-[4px] border-l-[#F2C94C]',
                text: 'text-[#F2C94C]',
                badge: 'bg-[#F2C94C] text-white'
            }
        }

        const style = styles[variant as keyof typeof styles] || styles.red

        return (
            <div className={`w-full h-full p-3 rounded-md ${style.border} ${style.bg} flex flex-col gap-1.5 overflow-hidden font-mukta shadow-sm`}>
                <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${style.badge}`}>{status}</span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                    <User size={14} className={style.text} />
                    <span className={`truncate font-medium text-sm ${style.text}`}>{eventInfo.event.title}</span>
                </div>

                <div className="flex items-center gap-2">
                    <FileText size={14} className={style.text} />
                    <span className={`truncate text-sm ${style.text}`}>{type}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock size={14} className={style.text} />
                    <span className={`text-sm font-medium ${style.text}`}>{eventInfo.timeText}</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin size={14} className={style.text} />
                    <span className={`truncate text-sm ${style.text}`}>{location}</span>
                </div>
            </div>
        )
    }

    const renderHeader = (arg: { date: Date }) => {
        const dayName = arg.date.toLocaleDateString('en-US', { weekday: 'short' })
        const dayNumber = arg.date.getDate()

        return (
            <div className="fc-col-header-cell-cushion font-semibold">
                {dayName}({dayNumber})
            </div>
        )
    }

    return (
        <div className='schedule-calendar h-full w-full 
            [&_.fc-event]:bg-transparent [&_.fc-event]:border-none [&_.fc-event]:shadow-none
            [&_.fc-v-event]:bg-transparent [&_.fc-v-event]:border-none [&_.fc-v-event]:shadow-none
            [&_.fc-timegrid-event]:rounded-md
            [&_.fc-event-time]:hidden [&_.fc-event-title]:hidden
            [&_.fc-col-header-cell]:bg-white [&_.fc-col-header-cell]:border-b-2 [&_.fc-col-header-cell]:border-gray-200
            [&_.fc-scrollgrid]:border [&_.fc-scrollgrid]:border-gray-200
            [&_.fc-timegrid-slot]:border-gray-100
            [&_.fc-timegrid-axis]:border-gray-200
            [&_.fc-timegrid-divider]:border-gray-200
            [&_.fc-col-header]:border-gray-200
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
                height="100%"
                contentHeight="auto"
                dayHeaderClassNames="py-3 text-[#1D1D1D] font-bold text-base font-mukta"
                slotLabelClassNames="text-sm text-gray-600 font-medium pr-3 font-mukta"
            />
        </div>
    )
}
