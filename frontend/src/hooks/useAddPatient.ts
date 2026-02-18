import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddPatientMutation } from "@/lib/store/services/patient/patientApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";
import parsePhoneNumber from 'libphonenumber-js';

const addPatientSchema = z.object({
  recordNumber: z.string().optional(),
  forename: z.string().min(2, "Forename must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.enum(["male", "female"]),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  notes: z.string().optional(),
  phoneNumber: z.string().refine((val) => {
    try {
      const phone = parsePhoneNumber(val, 'PK');
      return phone ? phone.isValid() : false;
    } catch {
      return false;
    }
  }, "Invalid phone number"),
  status: z.enum(["recovered", "awaiting_surgery", "on_treatment"]),
});

export type AddPatientFormValues = z.infer<typeof addPatientSchema>;

export const useAddPatient = () => {
  const [addPatient, { isLoading, isError, error }] = useAddPatientMutation();
  const navigate = useNavigate();

  const form = useForm<AddPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
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

  const onSubmit = async (data: AddPatientFormValues) => {
    try {
      await addPatient({
        forename: data.forename,
        surname: data.surname,
        dateOfBirth: data.dateOfBirth,
        sex: data.sex,
        diagnosis: data.diagnosis,
        notes: data.notes,
        phoneNumber: data.phoneNumber,
        status: data.status,
      }).unwrap();

      toast.success("Patient Added Successfully", {
        description: `${data.forename} ${data.surname} has been registered.`,
        duration: 4000,
      });
      navigate("/dashboard/patients");
    } catch (err) {
      toast.error("Error", {
        description: "Failed to add patient.",
      });
    }
  };

  useEffect(() => {
    if (isError && error) {
      let errorMessage = "Something went wrong. Please try again.";
      let errorTitle = "Failed to Add Patient";

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