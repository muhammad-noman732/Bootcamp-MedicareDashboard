import { useState, useCallback } from "react"
import { useUpdateAppointment } from "@/hooks/useUpdateAppointment"
import type { AppointmentWithPatient } from "@/types/appointment"

export function useUpdateAppointmentModal(appointment: AppointmentWithPatient, onClose: () => void) {
    const { form, isLoading, onSubmit } = useUpdateAppointment({
        appointment,
        onSuccess: onClose
    })

    const { register, watch, setValue } = form

    const [isEditingDateTime, setIsEditingDateTime] = useState(false)
    const [isEditingLocation, setIsEditingLocation] = useState(false)

    const selectedStatus = watch("status")
    const selectedDuration = watch("duration")
    const selectedType = watch("type")
    const selectedIsOnline = watch("isOnline")
    const selectedClinic = watch("clinic")
    const selectedRoom = watch("room")

    const toggleEditingDateTime = useCallback(() => setIsEditingDateTime(prev => !prev), [])
    const toggleEditingLocation = useCallback(() => setIsEditingLocation(prev => !prev), [])

    return {
        isLoading,
        onSubmit,
        register,
        setValue,
        isEditingDateTime,
        toggleEditingDateTime,
        isEditingLocation,
        toggleEditingLocation,
        selectedStatus,
        selectedDuration,
        selectedType,
        selectedIsOnline,
        selectedClinic,
        selectedRoom
    }
}