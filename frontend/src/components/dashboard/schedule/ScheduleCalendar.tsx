import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Clock, FileText, MapPin, User } from 'lucide-react'
import type { EventContentArg } from '@fullcalendar/core'

interface ScheduleCalendarProps {
    events?: any[]
}

const MOCK_EVENTS = [
    {
        id: '1',
        title: 'John Adekeye',
        start: '2024-11-25T09:00:00',
        end: '2024-11-25T09:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'red'
        }
    },
    {
        id: '2',
        title: 'John Adekeye',
        start: '2024-11-25T10:00:00',
        end: '2024-11-25T10:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'blue'
        }
    },
    {
        id: '3',
        title: 'John Adekeye',
        start: '2024-11-26T10:00:00',
        end: '2024-11-26T10:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'red'
        }
    },
    {
        id: '4',
        title: 'John Adekeye',
        start: '2024-11-27T09:00:00',
        end: '2024-11-27T09:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'green'
        }
    },
    {
        id: '5',
        title: 'John Adekeye',
        start: '2024-11-27T10:00:00',
        end: '2024-11-27T10:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'green'
        }
    },
    {
        id: '6',
        title: 'John Adekeye',
        start: '2024-11-27T12:00:00',
        end: '2024-11-27T12:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'green'
        }
    },
    {
        id: '7',
        title: 'John Adekeye',
        start: '2024-11-28T10:45:00',
        end: '2024-11-28T11:30:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'blue'
        }
    },
    {
        id: '8',
        title: 'John Adekeye',
        start: '2024-11-28T12:00:00',
        end: '2024-11-28T12:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'blue'
        }
    },
    {
        id: '9',
        title: 'John Adekeye',
        start: '2024-11-29T09:00:00',
        end: '2024-11-29T09:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'red'
        }
    },
    {
        id: '10',
        title: 'John Adekeye',
        start: '2024-11-29T10:00:00',
        end: '2024-11-29T10:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'red'
        }
    },
    {
        id: '11',
        title: 'John Adekeye',
        start: '2024-11-29T12:00:00',
        end: '2024-11-29T12:45:00',
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'red'
        }
    },
    {
        id: '12',
        title: 'John Adekeye',
        start: '2024-11-30T10:00:00',
        end: '2024-11-30T10:45:00', // Saturday
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'yellow'
        }
    },
    {
        id: '13',
        title: 'John Adekeye',
        start: '2024-11-30T13:00:00',
        end: '2024-11-30T13:45:00', // Saturday
        extendedProps: {
            type: 'Medical appointment',
            location: 'General clinic',
            status: 'Pending',
            variant: 'yellow'
        }
    }
]

export const ScheduleCalendar = ({ events = MOCK_EVENTS }: ScheduleCalendarProps) => {

    const renderEventContent = (eventInfo: EventContentArg) => {
        const { extendedProps } = eventInfo.event
        const { variant, status, type, location } = extendedProps

        // Variant styles
        const styles = {
            red: {
                bg: 'bg-[#FFECEC]',
                border: 'border-l-[#F85656]',
                text: 'text-[#F85656]',
                badge: 'bg-[#FFD4D4] text-[#F85656]'
            },
            green: {
                bg: 'bg-[#E8F8F0]',
                border: 'border-l-[#2ECC71]',
                text: 'text-[#2ECC71]',
                badge: 'bg-[#C8EED9] text-[#2ECC71]'
            },
            blue: {
                bg: 'bg-[#E6F0FF]',
                border: 'border-l-[#3B82F6]',
                text: 'text-[#3B82F6]',
                badge: 'bg-[#CCE0FF] text-[#3B82F6]'
            },
            yellow: {
                bg: 'bg-[#FFF9E6]',
                border: 'border-l-[#F1C40F]',
                text: 'text-[#F1C40F]',
                badge: 'bg-[#FFEDB3] text-[#F1C40F]'
            }
        }

        const style = styles[variant as keyof typeof styles] || styles.red

        return (
            <div className={`w-full h-full p-2 text-xs font-medium rounded-r-md border-l-[3px] ${style.border} ${style.bg} ${style.text} flex flex-col gap-1 overflow-hidden font-mukta`}>
                <div className="flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${style.badge}`}>{status}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                    <User size={10} className={style.text} />
                    <span className="truncate">{eventInfo.event.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <FileText size={10} className={style.text} />
                    <span className="truncate">{type}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Clock size={10} className={style.text} />
                    <span>{eventInfo.timeText}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <MapPin size={10} className={style.text} />
                    <span className="truncate">{location}</span>
                </div>
            </div>
        )
    }

    const renderHeader = (arg: any) => {
        // Custom header to match "Mon(25)" format
        // arg.date is a Date object
        const dayName = arg.date.toLocaleDateString('en-US', { weekday: 'short' })
        const dayNumber = arg.date.getDate()

        return (
            <div className="fc-col-header-cell-cushion ">
                {dayName}({dayNumber})
            </div>
        )
    }

    return (
        <div className='schedule-calendar h-full w-full 
            [&_.fc-event]:bg-transparent [&_.fc-event]:border-none [&_.fc-event]:shadow-none
            [&_.fc-v-event]:bg-transparent [&_.fc-v-event]:border-none [&_.fc-v-event]:shadow-none
            [&_.fc-timegrid-event]:rounded-none
            [&_.fc-event-time]:hidden [&_.fc-event-title]:hidden
            [&_.fc-col-header-cell]:bg-white
            [&_.fc-scrollgrid]:border-none
            [&_.fc-scroller]:!overflow-visible [&_.fc-scroller-liquid-absolute]:!overflow-visible
        '>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                initialDate="2024-11-25" // Fixed date to match specific "Mon(25)" requirement from user/screenshot
                firstDay={1} // Monday start
                headerToolbar={false} // Hiding toolbar to match screenshot which just shows grid
                dayHeaderContent={renderHeader}
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false
                }}
                allDaySlot={false}
                slotMinTime="09:00:00"
                slotMaxTime="14:00:00" // Based on screenshot range roughly
                expandRows={true}
                events={events}
                eventContent={renderEventContent}
                eventMinHeight={110}
                slotDuration="01:00:00"
                slotLabelInterval="01:00"
                height="100%"
                contentHeight="auto"
                dayHeaderClassNames="py-4 text-[#1D1D1D] font-bold text-base font-mukta"
                slotLabelClassNames="text-sm text-gray-500 font-medium pr-2 font-mukta"
            />
        </div>
    )
}
