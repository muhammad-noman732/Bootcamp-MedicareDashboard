import { StatusBadge } from "./StatusBadge"
import { PatientActions } from "./PatientActions"
import type { Patient } from "@/types"

type PatientTableRowProps = {
  patient: Patient
}

export function PatientTableRow({ patient }: PatientTableRowProps) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3 text-sm text-dark font-mukta">{patient.name}</td>
      <td className="px-4 py-3 text-sm text-dark font-mukta">
        {patient.diagnosis}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={patient.status} />
      </td>
      <td className="px-4 py-3 text-sm text-dark font-mukta">
        {patient.lastAppointment}
      </td>
      <td className="px-4 py-3 text-sm text-dark font-mukta">
        {patient.nextAppointment}
      </td>
      <td className="px-4 py-3">
        <PatientActions patient={patient} />
      </td>
    </tr>
  )
}
