import z from "zod";


export const appointmentSchema = z.object({
    date: z.date(),
    time: z.date(),
    clinic: z.string().min(3, "clinic name must be at least 4 characters"),
    room: z.string("Room number is required"),
    purpose: z.string(),
    type: z.enum([""]),
    duration: z.number,
    status: z.enum([]),
})

export type CreateAppoinmentSchema = z.infer<typeof appointmentSchema>

