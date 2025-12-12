import { useMemo } from "react"

import type { PatientsData } from "@/types"

export function usePatients(): PatientsData {
  const patients = useMemo(
    () => [
      {
        id: "1",
        name: "Mary Joseph",
        diagnosis: "Malaria",
        status: "recovered" as const,
        lastAppointment: "20/10/2022",
        nextAppointment: "1/12/2022",
      },
      {
        id: "2",
        name: "Amala Jones",
        diagnosis: "Stroke",
        status: "awaiting-surgery" as const,
        lastAppointment: "11/10/2022",
        nextAppointment: "1/12/2022",
      },
      {
        id: "3",
        name: "Damilola Oyin",
        diagnosis: "Liver failure",
        status: "on-treatment" as const,
        lastAppointment: "9/10/2022",
        nextAppointment: "1/11/2022",
      },
      {
        id: "4",
        name: "Selim jubril",
        diagnosis: "Typhoid",
        status: "awaiting-surgery" as const,
        lastAppointment: "12/10/2022",
        nextAppointment: "2/12/2022",
      },
      {
        id: "5",
        name: "Paul christian",
        diagnosis: "Gonorrhea",
        status: "on-treatment" as const,
        lastAppointment: "22/10/2022",
        nextAppointment: "3/12/2022",
      },
      {
        id: "6",
        name: "Rosabel Briggs",
        diagnosis: "Malaria",
        status: "recovered" as const,
        lastAppointment: "23/10/2022",
        nextAppointment: "4/12/2022",
      },
      {
        id: "7",
        name: "Tina Adekeye",
        diagnosis: "Syphilis",
        status: "recovered" as const,
        lastAppointment: "19/10/2022",
        nextAppointment: "5/12/2022",
      },
      {
        id: "8",
        name: "Mark Bossman",
        diagnosis: "Malaria",
        status: "recovered" as const,
        lastAppointment: "17/10/2022",
        nextAppointment: "2/12/2022",
      },
    ],
    []
  )

  return {
    total: 487,
    patients,
    currentPage: 1,
    totalPages: 41,
  }
}

