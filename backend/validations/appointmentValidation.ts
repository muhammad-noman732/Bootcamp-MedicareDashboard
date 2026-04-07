import z from "zod";

export const appointmentSchema = z.object({
    patientId: z.string().min(1, "Patient is required"),
    date: z.string().or(z.date()),
    time: z.string().regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format. Expected HH:mm (e.g., 09:00)"
    ),
    clinic: z.string().min(3, "Clinic name must be at least 3 characters"),
    room: z.string().min(1, "Room number is required"),
    purpose: z.string().optional(),
    type: z.enum(["first_time", "follow_up"], {
        message: "Type must be either 'first_time' or 'follow_up'"
    }),
    duration: z.number()
        .min(10, "Duration must be at least 10 minutes")
        .max(240, "Duration cannot exceed 240 minutes"),
    status: z.enum(["pending", "confirmation_required", "confirmed"], {
        message: "Invalid appointment status"
    }),
    isOnline: z.boolean().default(false),
    notifications: z.boolean().default(true),
});

export const updateAppointmentSchema = appointmentSchema.partial();

export const appointmentIdSchema = z.object({
    id: z.string().min(1, "Appointment ID is required")
});

export const dateRangeQuerySchema = z.object({
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date format. Use YYYY-MM-DD"
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end date format. Use YYYY-MM-DD"
    })
});

export type CreateAppointmentSchema = z.infer<typeof appointmentSchema>;
export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>;
export type AppointmentIdSchema = z.infer<typeof appointmentIdSchema>;
export type DateRangeQuerySchema = z.infer<typeof dateRangeQuerySchema>;
