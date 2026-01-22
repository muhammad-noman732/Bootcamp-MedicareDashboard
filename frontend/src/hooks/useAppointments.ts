import { useMemo, useState, useCallback } from "react";
import { useGetAppointmentsQuery } from "@/lib/store/services/appointment/appointmentApi";

const getVariantByStatus = (status: string): string => {
    switch (status) {
        case "confirmed":
            return "green";
        case "confirmation_required":
            return "yellow";
        case "pending":
            return "red";
        default:
            return "blue";
    }
};

const getWeekRange = (date: Date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay() + 1;
    const last = first + 6;

    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(last));

    return { firstDay, lastDay };
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
    const year = endDate.getFullYear();

    if (startMonth === endMonth) {
        return `Weekly schedule from ${startDay}${getOrdinalSuffix(startDay)} to ${endDay}${getOrdinalSuffix(endDay)} ${startMonth} ${year}`;
    } else {
        return `Weekly schedule from ${startDay}${getOrdinalSuffix(startDay)} ${startMonth} to ${endDay}${getOrdinalSuffix(endDay)} ${endMonth} ${year}`;
    }
};

const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

export const useAppointments = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { data, isLoading, error } = useGetAppointmentsQuery();

    const { firstDay, lastDay } = useMemo(() => getWeekRange(currentDate), [currentDate]);

    const dateRangeLabel = useMemo(
        () => formatDateRange(firstDay, lastDay),
        [firstDay, lastDay]
    );

    const calendarEvents = useMemo(() => {
        if (!data?.data) return [];

        return data.data.map((appointment) => {
            const patientName = appointment.patient
                ? `${appointment.patient.forename} ${appointment.patient.surname}`
                : "";

            return {
                id: appointment.id,
                title: patientName,
                start: appointment.startTime,
                end: appointment.endTime,
                extendedProps: {
                    type: appointment.type === "first_time" ? "First Time" : "Follow Up",
                    location: appointment.clinic || "General clinic",
                    status: appointment.status === "confirmed"
                        ? "Confirmed"
                        : appointment.status === "confirmation_required"
                            ? "Confirmation Required"
                            : "Pending",
                    variant: getVariantByStatus(appointment.status),
                    purpose: appointment.purpose,
                    room: appointment.room,
                    isOnline: appointment.isOnline,
                },
            };
        });
    }, [data]);

    const goToNextWeek = useCallback(() => {
        setCurrentDate((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + 7);
            return next;
        });
    }, []);

    const goToPreviousWeek = useCallback(() => {
        setCurrentDate((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() - 7);
            return next;
        });
    }, []);

    const goToToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    return {
        appointments: data?.data || [],
        calendarEvents,
        isLoading,
        error,
        count: data?.count || 0,
        dateRangeLabel,
        currentDate,
        goToNextWeek,
        goToPreviousWeek,
        goToToday,
    };
};
