import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAppointmentsQuery, useDeleteAppointmentMutation } from "@/lib/store/services/appointment/appointmentApi";
import { isSameDay, isFuture, addMinutes } from "date-fns";
import { toast } from "sonner";
import type { AppointmentWithPatient } from "@/types/appointment";

export function useUpcomingSchedule() {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [appointmentToUpdate, setAppointmentToUpdate] = useState<AppointmentWithPatient | null>(null);

    const { data, isLoading } = useGetAppointmentsQuery();
    const [deleteAppointment] = useDeleteAppointmentMutation();

    const today = useMemo(() => new Date(), []);

    const appointments = useMemo(() => {
        if (!data?.data) return [];
        return [...data.data]
            .filter(app => isSameDay(new Date(app.startTime), today))
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [data, today]);

    const activeAppointmentId = useMemo(() => {
        const upcoming = appointments.find(app => {
            const startTime = new Date(app.startTime);
            const endTime = app.endTime ? new Date(app.endTime) : addMinutes(startTime, app.duration || 30);
            return isFuture(endTime);
        });
        return upcoming?.id || null;
    }, [appointments]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteAppointment(id).unwrap();
            toast.success("Appointment deleted successfully");
            if (selectedId === id) setSelectedId(null);
        } catch (error) {
            toast.error("Failed to delete appointment");
        }
    }, [deleteAppointment, selectedId]);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const openUpdateModal = useCallback((app: AppointmentWithPatient) => {
        setAppointmentToUpdate(app);
        setIsUpdateModalOpen(true);
    }, []);

    const closeUpdateModal = useCallback(() => {
        setIsUpdateModalOpen(false);
        setAppointmentToUpdate(null);
    }, []);

    const toggleExpand = useCallback((id: string) => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);

    const beginAppointment = useCallback((app: AppointmentWithPatient) => {
        toast.success("Consultation Started", {
            description: `Session with ${app.patient.forename} ${app.patient.surname} has begun.`
        });
        navigate("/dashboard/patients");
    }, [navigate]);

    return {
        appointments,
        isLoading,
        activeAppointmentId,
        selectedId,
        toggleExpand,
        handleDelete,
        isModalOpen,
        openModal,
        closeModal,
        isUpdateModalOpen,
        openUpdateModal,
        closeUpdateModal,
        appointmentToUpdate,
        beginAppointment,
        navigate
    };
}