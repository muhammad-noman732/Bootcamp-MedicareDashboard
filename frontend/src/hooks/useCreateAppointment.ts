import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateAppointmentMutation } from "@/lib/store/services/appointment/appointmentApi";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";

const createAppointmentSchema = z.object({
    patientId: z.string().min(1, "Patient is required"),
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

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>;

interface UseCreateAppointmentProps {
    onSuccess?: () => void;
}

export const useCreateAppointment = ({ onSuccess }: UseCreateAppointmentProps = {}) => {
    const [createAppointment, { isLoading, isError, error }] = useCreateAppointmentMutation();

    const todayStr = [
        new Date().getFullYear(),
        (new Date().getMonth() + 1).toString().padStart(2, '0'),
        new Date().getDate().toString().padStart(2, '0')
    ].join('-');

    const form = useForm<CreateAppointmentFormValues>({
        resolver: zodResolver(createAppointmentSchema),
        defaultValues: {
            patientId: "",
            date: todayStr,
            time: "09:00",
            duration: 60,
            clinic: "General clinic",
            room: "Room 1",
            purpose: "",
            type: "first_time",
            status: "confirmed",
            isOnline: false,
            notifications: true,
        },
    });


    const onSubmit = async (data: CreateAppointmentFormValues) => {
        try {
            await createAppointment({
                patientId: data.patientId,
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
            }).unwrap();

            toast.success("Appointment Scheduled", {
                description: "The appointment has been created successfully.",
                duration: 4000,
            });

            form.reset();

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Error", {
                description: "Failed to schedule appointment.",
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Failed to Schedule Appointment";

            if ('status' in error) {
                const status = error.status;

                if (status === 400) {
                    errorTitle = "Invalid Data";
                    errorMessage = "Please check the form fields and try again.";
                } else if (status === 401) {
                    errorTitle = "Session Expired";
                    errorMessage = "Please login again to continue.";
                } else if (status === 500) {
                    errorTitle = "Server Error";
                    errorMessage = "Our servers are having issues. Please try again later.";
                }

                if ('data' in error && error.data) {
                    const errorData = error.data as BackendErrorData & { errors?: Array<{ message: string; path: string[] }> };

                    if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                        errorMessage = errorData.errors[0].message;
                    } else if (errorData.message) {
                        if (errorData.message.trim().startsWith('{') || errorData.message.trim().startsWith('[')) {
                            try {
                                const parsed = JSON.parse(errorData.message);
                                if (Array.isArray(parsed) && parsed[0]?.message) {
                                    errorMessage = parsed[0].message;
                                } else if (parsed.message) {
                                    errorMessage = parsed.message;
                                } else {
                                    errorMessage = "Invalid data provided. Please check your inputs.";
                                }
                            } catch {
                                errorMessage = "Invalid data provided.";
                            }
                        } else {
                            errorMessage = errorData.message;
                        }
                    }
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
