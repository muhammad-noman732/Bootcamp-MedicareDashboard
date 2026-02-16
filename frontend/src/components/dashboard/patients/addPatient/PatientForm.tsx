import { Calendar } from "lucide-react"
import { Controller } from "react-hook-form"
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FormField } from "./FormField"
import { SexToggle } from "./SexToggle"
import { TextareaField } from "./TextareaField"
import { FormRow } from "./FormRow"
import type { AddPatientFormValues } from "@/hooks/useAddPatient"

type PatientFormProps = {
  register: UseFormRegister<AddPatientFormValues>
  control: Control<AddPatientFormValues>
  errors: FieldErrors<AddPatientFormValues>
  setValue: UseFormSetValue<AddPatientFormValues>
  watch: UseFormWatch<AddPatientFormValues>
  isLoading?: boolean
}

export function PatientForm({
  register,
  control,
  errors,
  setValue,
  watch,
  isLoading,
}: PatientFormProps) {
  return (
    <div className="space-y-6">
      <FormRow label="Forename" htmlFor="forename">
        <FormField
          id="forename"
          {...register("forename")}
          placeholder="Enter forename"
          error={errors.forename?.message}
          onClear={() => setValue("forename", "")}
          value={watch("forename")}
        />
      </FormRow>

      <FormRow label="Surname" htmlFor="surname">
        <FormField
          id="surname"
          {...register("surname")}
          placeholder="Enter surname"
          error={errors.surname?.message}
          onClear={() => setValue("surname", "")}
          value={watch("surname")}
        />
      </FormRow>

      <FormRow label="Date of birth" htmlFor="dateOfBirth">
        <FormField
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth")}
          icon={<Calendar size={18} />}
          iconPosition="left"
          error={errors.dateOfBirth?.message}
        />
      </FormRow>

      <FormRow label="Sex">
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <SexToggle
              value={field.value}
              onChange={field.onChange}
              error={errors.sex?.message}
              disabled={isLoading}
            />
          )}
        />
      </FormRow>

      <FormRow label="Diagnosis" htmlFor="diagnosis">
        <FormField
          id="diagnosis"
          {...register("diagnosis")}
          placeholder="Enter diagnosis"
          error={errors.diagnosis?.message}
        />
      </FormRow>

      <FormRow label="Notes" htmlFor="notes">
        <TextareaField
          id="notes"
          {...register("notes")}
          placeholder="Enter notes (optional)"
          rows={4}
        />
      </FormRow>

      <FormRow label="Phone number" htmlFor="phoneNumber">
        <FormField
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber")}
          placeholder="Enter phone number"
          error={errors.phoneNumber?.message}
        />
      </FormRow>
    </div>
  )
}