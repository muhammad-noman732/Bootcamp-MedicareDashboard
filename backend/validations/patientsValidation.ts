import * as z from "zod";
import parsePhoneNumber from 'libphonenumber-js';

const internationalPhoneSchema = z.string().refine((value) => {
    try {
        const phoneNumber = parsePhoneNumber(value, 'PK');
        return phoneNumber?.isValid();
    } catch {
        return false;
    }
}, {
    message: 'Invalid phone number (e.g. +923001234567 or 03001234567)',
});

export const createPatientSchema = z.object({
    forename: z.string().min(3, "Forename must be at least 3 characters long"),
    surname: z.string().min(3, "Surname must be at least 3 characters long"),
    dateOfBirth: z.coerce.date().max(new Date(), "Date of birth must be in the past"),
    diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters long"),
    sex: z.enum(["male", "female"]),
    notes: z.string().optional(),
    phoneNumber: internationalPhoneSchema,
})

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientSchema = z.infer<typeof createPatientSchema>
export type UpdatePatientSchema = z.infer<typeof updatePatientSchema>