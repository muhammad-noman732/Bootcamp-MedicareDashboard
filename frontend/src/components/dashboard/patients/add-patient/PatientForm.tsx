import { Calendar } from "lucide-react"

import { FormField } from "./FormField"
import { RecordNumberField } from "./RecordNumberField"
import { SexToggle } from "./SexToggle"
import { TextareaField } from "./TextareaField"
import type { AddPatientFormData, AddPatientFormErrors } from "@/types"

type PatientFormProps = {
  formData: AddPatientFormData
  errors: AddPatientFormErrors
  isManualRecordNumber: boolean
  onToggleManualRecordNumber: () => void
  onUpdateField: (field: keyof AddPatientFormData, value: string) => void
  onClearField: (field: keyof AddPatientFormData) => void
}

export function PatientForm({
  formData,
  errors,
  isManualRecordNumber,
  onToggleManualRecordNumber,
  onUpdateField,
  onClearField,
}: PatientFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // Form submission is handled by the Save button in AddPatientHeader
        // This prevents default form submission behavior
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <RecordNumberField
          isManual={isManualRecordNumber}
          value={formData.recordNumber || ""}
          onToggleManual={onToggleManualRecordNumber}
          onChange={(value) => onUpdateField("recordNumber", value)}
          error={errors.recordNumber}
        />

        {/* Right Column */}
        <FormField
          label="Forename"
          id="forename"
          value={formData.forename}
          onChange={(value) => onUpdateField("forename", value)}
          onClear={() => onClearField("forename")}
          placeholder="Enter forename"
          error={errors.forename}
        />

        {/* Left Column */}
        <FormField
          label="Surname"
          id="surname"
          value={formData.surname}
          onChange={(value) => onUpdateField("surname", value)}
          onClear={() => onClearField("surname")}
          placeholder="Enter surname"
          error={errors.surname}
        />

        {/* Right Column */}
        <FormField
          label="Date of birth"
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(value) => onUpdateField("dateOfBirth", value)}
          icon={<Calendar size={18} />}
          iconPosition="left"
          error={errors.dateOfBirth}
        />

        {/* Left Column */}
        <SexToggle
          value={formData.sex}
          onChange={(value) => onUpdateField("sex", value)}
          error={errors.sex}
        />

        {/* Right Column */}
        <FormField
          label="Diagnosis"
          id="diagnosis"
          value={formData.diagnosis}
          onChange={(value) => onUpdateField("diagnosis", value)}
          placeholder="Enter diagnosis"
          error={errors.diagnosis}
        />

        {/* Left Column */}
        <TextareaField
          label="Notes"
          id="notes"
          value={formData.notes}
          onChange={(value) => onUpdateField("notes", value)}
          placeholder="Enter notes"
          rows={4}
          error={errors.notes}
        />

        {/* Right Column */}
        <FormField
          label="Phone number"
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(value) => onUpdateField("phoneNumber", value)}
          placeholder="Enter phone number"
          error={errors.phoneNumber}
        />
      </div>
    </form>
  )
}

