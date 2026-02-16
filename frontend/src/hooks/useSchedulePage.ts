import { useState, useCallback } from "react";
import { useAppointments } from "./useAppointments";

export function useSchedulePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { calendarEvents, isLoading, dateRangeLabel, currentDate } = useAppointments();

    const handleFilter = useCallback(() => {

    }, []);

    const handlePrint = useCallback(() => {

    }, []);

    const handleHelp = useCallback(() => {

    }, []);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    return {
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
    };
}