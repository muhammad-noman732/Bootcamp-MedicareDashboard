import { useState } from "react"
import { Calendar } from "lucide-react"

import { AddPatientHeader } from "@/components/dashboard/patients/add-patient/AddPatientHeader"
import { FormField } from "@/components/dashboard/patients/add-patient/FormField"
import { FormRow } from "@/components/dashboard/patients/add-patient/FormRow"
import { RecordNumberField } from "@/components/dashboard/patients/add-patient/RecordNumberField"
import { SexToggle } from "@/components/dashboard/patients/add-patient/SexToggle"
import { TextareaField } from "@/components/dashboard/patients/add-patient/TextareaField"

export const AddPatientPage = () => {
  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save clicked")
  }

  // Placeholder state - just for UI
  const [isManualRecordNumber, setIsManualRecordNumber] = useState(false)

  return (
    <div className="flex flex-col h-[83vh] overflow-hidden px-[26px] pt-[15px]">
      <div className="flex-shrink-0">
        <div className="text-sm text-muted-foreground mb-[13px]">
          Patient registrer &gt; Add patient
        </div>
        <AddPatientHeader onSave={handleSave} />
      </div>

      <div className="flex-1 min-h-0 mt-6 flex items-start justify-center">
        <div className="w-full lg:w-[780px] max-h-full bg-white rounded-lg p-6 overflow-y-auto">
          <div className="space-y-6">
            <FormRow label="Record number">
              <RecordNumberField
                isManual={isManualRecordNumber}
                value=""
                onToggleManual={() => setIsManualRecordNumber(!isManualRecordNumber)}
                onChange={() => {}}
              />
            </FormRow>

            <FormRow label="Forename" htmlFor="forename">
              <FormField
                label=""
                id="forename"
                value=""
                onChange={() => {}}
                onClear={() => {}}
                placeholder="Enter forename"
              />
            </FormRow>

            <FormRow label="Surname" htmlFor="surname">
              <FormField
                label=""
                id="surname"
                value=""
                onChange={() => {}}
                onClear={() => {}}
                placeholder="Enter surname"
              />
            </FormRow>

            <FormRow label="Date of birth" htmlFor="dateOfBirth">
              <FormField
                label=""
                id="dateOfBirth"
                type="date"
                value=""
                onChange={() => {}}
                icon={<Calendar size={18} />}
                iconPosition="left"
              />
            </FormRow>

            <FormRow label="Sex">
              <SexToggle value="" onChange={() => {}} />
            </FormRow>

            <FormRow label="Diagnosis" htmlFor="diagnosis">
              <FormField
                label=""
                id="diagnosis"
                value=""
                onChange={() => {}}
                placeholder="Enter diagnosis"
              />
            </FormRow>

            <FormRow label="Notes" htmlFor="notes">
              <TextareaField
                label=""
                id="notes"
                value=""
                onChange={() => {}}
                placeholder="Enter notes"
                rows={4}
              />
            </FormRow>

            <FormRow label="Phone number" htmlFor="phoneNumber">
              <FormField
                label=""
                id="phoneNumber"
                type="tel"
                value=""
                onChange={() => {}}
                placeholder="Enter phone number"
              />
            </FormRow>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPatientPage

