import { useState } from "react"
import { useNavigate } from "react-router-dom"

import type { AddPatientFormData, AddPatientFormErrors } from "@/types"

export function useAddPatient() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<AddPatientFormData>({
    recordNumber: "",
    forename: "",
    surname: "",
    dateOfBirth: "",
    sex: "",
    diagnosis: "",
    notes: "",
    phoneNumber: "",
  })

  const [errors, setErrors] = useState<AddPatientFormErrors>({})
  const [isManualRecordNumber, setIsManualRecordNumber] = useState(false)

  const toggleManualRecordNumber = () => {
    setIsManualRecordNumber((prev) => {
      const newValue = !prev
      // Clear recordNumber when switching to automatic mode
      if (!newValue) {
        setFormData((prevData) => ({ ...prevData, recordNumber: "" }))
        setErrors((prevErrors) => ({ ...prevErrors, recordNumber: undefined }))
      }
      return newValue
    })
  }

  const updateField = (field: keyof AddPatientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: AddPatientFormErrors = {}

    // Validate recordNumber only if manual mode is enabled
    if (isManualRecordNumber && !formData.recordNumber?.trim()) {
      newErrors.recordNumber = "Record number is required when assigning manually"
    }

    if (!formData.forename.trim()) {
      newErrors.forename = "Forename is required"
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Surname is required"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }

    if (!formData.sex) {
      newErrors.sex = "Sex is required"
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      // Prepare submission data
      const submissionData = {
        ...formData,
        // Only include recordNumber if manual mode is enabled
        recordNumber: isManualRecordNumber ? formData.recordNumber : undefined,
      }
      
      console.log("Form submitted:", submissionData)
      
      // TODO: Replace with actual API call
      // await api.addPatient(submissionData)
      
      // Navigate to patients list after successful submission
      navigate("/dashboard/patients")
    }
  }

  const clearField = (field: keyof AddPatientFormData) => {
    updateField(field, "")
  }

  return {
    formData,
    errors,
    isManualRecordNumber,
    setIsManualRecordNumber,
    updateField,
    clearField,
    handleSubmit,
  }
}

