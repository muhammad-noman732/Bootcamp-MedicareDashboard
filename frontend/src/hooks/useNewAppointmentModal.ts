import { useState, useCallback } from "react"
import { useCreateAppointment } from "@/hooks/useCreateAppointment"
import { useGetPatientsQuery } from "@/lib/store/services/patient/patientApi"
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi"

export function useNewAppointmentModal(onClose: () => void) {
    const { data: userData } = useGetCurrentUserQuery()
    const { data: patientsData, isLoading: isPatientsLoading } = useGetPatientsQuery({ limit: 100 })
    const { form, isLoading, onSubmit } = useCreateAppointment({ onSuccess: onClose })

    const { register, watch, setValue, formState: { errors } } = form

    const [isEditingDateTime, setIsEditingDateTime] = useState(false)
    const [isEditingLocation, setIsEditingLocation] = useState(false)

    const selectedStatus = watch("status")
    const selectedDuration = watch("duration")
    const selectedType = watch("type")
    const selectedIsOnline = watch("isOnline")
    const selectedDate = watch("date")
    const selectedTime = watch("time")
    const selectedClinic = watch("clinic")
    const selectedRoom = watch("room")

    const practitionerName = userData?.data?.userName || "John Doe"
    const practitionerSpecialty = "General Doctor"

    const formatDate = useCallback((dateStr: string) => {
        if (!dateStr) return "Select date"
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' })
    }, [])

    const toggleEditingDateTime = useCallback(() => setIsEditingDateTime(prev => !prev), [])
    const toggleEditingLocation = useCallback(() => setIsEditingLocation(prev => !prev), [])

    return {
        practitionerName,
        practitionerSpecialty,
        patientsData,
        isPatientsLoading,
        isLoading,
        onSubmit,
        register,
        errors,
        setValue,
        isEditingDateTime,
        toggleEditingDateTime,
        isEditingLocation,
        toggleEditingLocation,
        selectedStatus,
        selectedDuration,
        selectedType,
        selectedIsOnline,
        selectedDate,
        selectedTime,
        selectedClinic,
        selectedRoom,
        formatDate,
        onBeginAppointment: onSubmit
    }
}