import { PatientsHeader } from "@/components/dashboard/patients/PatientsHeader"
import { PatientsPagination } from "@/components/dashboard/patients/PatientsPagination"
import { PatientsTable } from "@/components/dashboard/patients/PatientsTable"
import { usePatients } from "@/hooks/usePatients"

export const PatientsPage = () => {
  const { total, patients, currentPage, totalPages, setPage } = usePatients()

  return (
    <div className="w-full max-w-[1169px] mx-auto max-h-[83vh] flex flex-col px-[26px] pt-[15px]">
      <div className="text-sm text-[#1D1D1D] mb-4">Patient register &gt; Patients</div>

      <div className="">
        <PatientsHeader total={total} />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <PatientsTable patients={patients} />
        </div>
      </div>

      <div className="mt-4 shrink-0">
        <PatientsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export default PatientsPage
