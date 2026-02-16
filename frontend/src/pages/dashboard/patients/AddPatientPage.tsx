import { AddPatientHeader } from "@/components/dashboard/patients/addPatient/AddPatientHeader"
import { PatientForm } from "@/components/dashboard/patients/addPatient/PatientForm"
import { useAddPatient } from "@/hooks/useAddPatient"

export const AddPatientPage = () => {
  const { form, isLoading, onSubmit } = useAddPatient()
  const { register, control, formState: { errors }, setValue, watch } = form

  return (
    <div className="flex flex-col h-[83vh] overflow-hidden px-[26px] pt-[15px]">
      <div className="flex-shrink-0">
        <div className="text-sm text-muted-foreground mb-[13px]">
          Patient register &gt; Add patient
        </div>
        <AddPatientHeader onSave={onSubmit} />
      </div>

      <div className="flex-1 min-h-0 mt-6 flex items-start justify-center">
        <div className="w-full lg:w-[780px] max-h-full bg-white rounded-lg p-6 overflow-y-auto">
          <form id="add-patient-form" onSubmit={onSubmit}>
            <PatientForm
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPatientPage