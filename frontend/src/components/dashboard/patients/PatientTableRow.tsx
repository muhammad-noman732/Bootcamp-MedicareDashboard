import { MoreHorizontal } from "lucide-react"

import { StatusBadge } from "./StatusBadge"
import type { Patient } from "@/types"

type PatientTableRowProps = {
  patient: Patient
}

export function PatientTableRow({ patient }: PatientTableRowProps) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3 text-sm text-[#1D1D1D]">{patient.name}</td>
      <td className="px-4 py-3 text-sm text-[#1D1D1D]">
        {patient.diagnosis}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={patient.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[#1D1D1D]">
        {patient.lastAppointment}
      </td>
      <td className="px-4 py-3 text-sm text-[#1D1D1D]">
        {patient.nextAppointment}
      </td>
      <td className="px-4 py-3">
        <button className="p-1 hover:bg-muted rounded">
          <MoreHorizontal size={18} className="text-[#828282]" />
        </button>
      </td>
    </tr>
  )
}

