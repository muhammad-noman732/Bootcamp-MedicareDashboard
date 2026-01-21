import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdatePatientMutation, useGetPatientQuery } from "@/lib/store/services/patient/patientApi";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";
import type { AddPatientFormValues } from "./useAddPatient";

const updatePatientSchema = z.object({
    recordNumber: z.string().optional(),
    forename: z.string().min(2, "Forename must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    sex: z.enum(["male", "female"]),
    diagnosis: z.string().min(1, "Diagnosis is required"),
    notes: z.string().optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    status: z.enum(["recovered", "awaiting_surgery", "on_treatment"]),
});

interface UseUpdatePatientProps {
    patientId: string
    isOpen: boolean
    onSuccess?: () => void
}

export const useUpdatePatient = ({ patientId, isOpen, onSuccess }: UseUpdatePatientProps) => {
    const { data: patientData, isLoading: isFetching } = useGetPatientQuery(patientId, {
        skip: !isOpen || !patientId,
    });

    const [updatePatient, { isLoading: isUpdating, isError, error }] = useUpdatePatientMutation();

    const form = useForm<AddPatientFormValues>({
        resolver: zodResolver(updatePatientSchema),
        defaultValues: {
            recordNumber: "",
            forename: "",
            surname: "",
            dateOfBirth: "",
            sex: "male",
            diagnosis: "",
            notes: "",
            phoneNumber: "",
            status: "on_treatment",
        },
    });

    useEffect(() => {
        if (patientData?.data) {
            const p = patientData.data;
            form.reset({
                recordNumber: p.recordNumber || "",
                forename: p.forename,
                surname: p.surname,
                dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : "",
                sex: p.sex,
                diagnosis: p.diagnosis,
                notes: p.notes || "",
                phoneNumber: p.phoneNumber,
                status: p.status,
            });
        }
    }, [patientData, form]);

    const onSubmit = async (data: AddPatientFormValues) => {
        try {
            await updatePatient({
                id: patientId,
                data: {
                    forename: data.forename,
                    surname: data.surname,
                    dateOfBirth: data.dateOfBirth,
                    sex: data.sex,
                    diagnosis: data.diagnosis,
                    notes: data.notes,
                    phoneNumber: data.phoneNumber,
                    status: data.status,
                },
            }).unwrap();

            toast.success("Patient Updated", {
                description: `${data.forename} ${data.surname} has been updated successfully.`,
            });
            onSuccess?.();
        } catch (err) {
            console.error("Update patient failed", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Update Failed";

            if ('status' in error) {
                if (error.status === 400) {
                    errorTitle = "Invalid Data";
                    errorMessage = "Please check the form fields.";
                }

                if ('data' in error && error.data) {
                    const errorData = error.data as BackendErrorData;
                    if (errorData.message) errorMessage = errorData.message;
                }
            }

            toast.error(errorTitle, { description: errorMessage });
        }
    }, [isError, error]);

    return {
        form,
        isFetching,
        isUpdating,
        onSubmit: form.handleSubmit(onSubmit),
    };
};
