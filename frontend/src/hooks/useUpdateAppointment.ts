import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateAppointmentMutation } from "@/lib/store/services/appointment/appointmentApi";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";
import type { AppointmentWithPatient } from "@/types/appointment";

const updateAppointmentSchema = z.object({
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    duration: z.number().min(5, "Duration must be at least 5 minutes"),
    clinic: z.string().optional(),
    room: z.string().optional(),
    purpose: z.string().optional(),
    type: z.enum(["first_time", "follow_up"]),
    status: z.enum(["pending", "confirmation_required", "confirmed"]),
    isOnline: z.boolean(),
    notifications: z.boolean(),
});

export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>;

interface UseUpdateAppointmentProps {
    appointment: AppointmentWithPatient;
    onSuccess?: () => void;
}

export const useUpdateAppointment = ({ appointment, onSuccess }: UseUpdateAppointmentProps) => {
    const [updateAppointment, { isLoading, isError, error }] = useUpdateAppointmentMutation();

    const form = useForm<UpdateAppointmentFormValues>({
        resolver: zodResolver(updateAppointmentSchema),
        defaultValues: {
            date: appointment.formattedDate,
            time: appointment.formattedTime,
            duration: appointment.duration,
            clinic: appointment.clinic || "General clinic",
            room: appointment.room || "Room 1",
            purpose: appointment.purpose || "",
            type: appointment.type,
            status: appointment.status,
            isOnline: appointment.isOnline,
            notifications: appointment.notifications,
        },
    });

    const onSubmit = async (data: UpdateAppointmentFormValues) => {
        try {
            await updateAppointment({
                id: appointment.id,
                data: {
                    date: data.date,
                    time: data.time,
                    duration: data.duration,
                    clinic: data.clinic,
                    room: data.room,
                    purpose: data.purpose,
                    type: data.type,
                    status: data.status,
                    isOnline: data.isOnline,
                    notifications: data.notifications,
                },
            }).unwrap();

            toast.success("Appointment Updated", {
                description: "The appointment has been updated successfully.",
                duration: 4000,
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Error", {
                description: "Failed to update profile.",
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Failed to Update Appointment";

            if ('status' in error) {
                const status = error.status;
                if (status === 400) {
                    errorTitle = "Invalid Data";
                } else if (status === 401) {
                    errorTitle = "Session Expired";
                }

                if ('data' in error && error.data) {
                    const errorData = error.data as BackendErrorData;
                    if (errorData.message) errorMessage = errorData.message;
                }
            }

            toast.error(errorTitle, {
                description: errorMessage,
                duration: 5000,
            });
        }
    }, [isError, error]);

    return {
        form,
        isLoading,
        onSubmit: form.handleSubmit(onSubmit),
    };
};
