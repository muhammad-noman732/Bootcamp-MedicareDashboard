import { PatientTableRow } from "./PatientTableRow"
import type { Patient } from "@/types"

type PatientsTableProps = {
  patients: Patient[]
}

export function PatientsTable({ patients }: PatientsTableProps) {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="h-[65px] border-b-[0.98px] border-b-[#E0E0E0]">
              <th className="px-4 text-left text-[17.65px] font-normal leading-[100%] tracking-[0.15%] text-[#828282]">
                Name
              </th>
              <th className="px-4 text-left text-[17.65px] font-normal leading-[100%] tracking-[0.15%] text-[#828282]">
                Diagnosis
              </th>
              <th className="px-4 text-left text-[17.65px] font-normal leading-[100%] tracking-[0.15%] text-[#828282]">
                Status
              </th>
              <th className="px-4 text-left text-[17.65px] font-normal leading-[100%] tracking-[0.15%] text-[#828282]">
                Last Appointment
              </th>
              <th className="px-4 text-left text-[17.65px] font-normal leading-[100%] tracking-[0.15%] text-[#828282]">
                Next appointment
              </th>
              <th className="px-4 text-left text-[17.65px] font-normal leading-[100%] tracking-[0.15%] text-[#828282]">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <PatientTableRow key={patient.id} patient={patient} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
